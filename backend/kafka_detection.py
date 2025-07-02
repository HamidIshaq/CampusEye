from confluent_kafka import Consumer, TopicPartition
import base64
import cv2
import numpy as np
import json
import zlib
import time
import os
import torch
from ultralytics import YOLO
from datetime import datetime

# Create output directories
VIDEO_OUTPUT_DIR = "cigarette_batch_videos"
FRAME_OUTPUT_DIR = "cigarette_detections"
os.makedirs(VIDEO_OUTPUT_DIR, exist_ok=True)
os.makedirs(FRAME_OUTPUT_DIR, exist_ok=True)

# Kafka configuration
consumer_config = {
    'bootstrap.servers': '192.168.94.205:9093',
    'group.id': 'frame-processing-group',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': False,  # Manual commit for better control
    'partition.assignment.strategy': 'cooperative-sticky'  # Helps maintain assignment
}

# YOLO model configuration
MODEL_PATH = "./best.pt"  # Update with your model path
CONF_THRESHOLD = 0.4  # Detection confidence threshold

# Load the YOLO model
print(f"Loading YOLO model from {MODEL_PATH}")
try:
    # Check if CUDA is available
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")
    
    model = YOLO(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

consumer = Consumer(consumer_config)
consumer.subscribe(['cameraFreame'])

# Dictionary to track multi-chunk batches
batches = {}

# Timeout for incomplete batches (seconds)
BATCH_TIMEOUT = 30

# Function to detect cigarettes in a frame using YOLO
def detect_cigarette(frame, conf_threshold=CONF_THRESHOLD):
    """
    Detect cigarettes in a frame using YOLO model
    
    Args:
        frame: OpenCV image (numpy array)
        conf_threshold: Confidence threshold for detection
    
    Returns:
        tuple: (is_cigarette_detected, confidence, annotated_frame)
    """
    try:
        # Run YOLO inference on the frame
       # results = model(frame, conf=conf_threshold)[0]
        results = model(frame, conf=conf_threshold, verbose=False)[0]

        
        # Process detection results
        smoking_detected = False
        max_confidence = 0.0
        
        # Create a copy of the frame to annotate
        annotated_frame = frame.copy()
        
        # Process each detection
        for detection in results.boxes.data.tolist():
            x1, y1, x2, y2, confidence, class_id = detection
            class_id = int(class_id)
            
            # Class 1 is for cigarette/smoking detection (adjust if your model uses different class IDs)
            if class_id == 1:  # Cigarette/smoking detection
                smoking_detected = True
                if confidence > max_confidence:
                    max_confidence = confidence
                
                # Draw bounding box and label (red color for cigarette)
                cv2.rectangle(annotated_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                label = f"Cigarette: {confidence:.2f}"
                cv2.putText(annotated_frame, label, (int(x1), int(y1) - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            elif class_id == 0:  # Person detection
                # Draw bounding box and label (green color for person)
                cv2.rectangle(annotated_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                label = f"Person: {confidence:.2f}"
                cv2.putText(annotated_frame, label, (int(x1), int(y1) - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return smoking_detected, max_confidence, annotated_frame
    
    except Exception as e:
        print(f"Detection error: {e}")
        return False, 0.0, frame

def save_detection_frame(frame, batch_id, frame_index, confidence):
    """Save individual detected frame."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{FRAME_OUTPUT_DIR}/cigarette_batch{batch_id}frame{frame_index}{timestamp}_{confidence:.2f}.jpg"
    cv2.imwrite(filename, frame)
    print(f"Saved cigarette detection frame to {filename}")

def save_batch_as_video(frames, batch_id, detection_frames):
    """Save entire batch as video if cigarettes were detected."""
    if not frames:
        print(f"Error: No frames to save for batch {batch_id}")
        return
    
    # Get first frame to determine video dimensions
    first_frame = frames[0]
    height, width = first_frame.shape[:2]
    
    # Generate timestamp for the filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    video_path = f"{VIDEO_OUTPUT_DIR}/cigarette_batch_{batch_id}_{timestamp}.mp4"
    
    # Create video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # MP4 codec
    fps = 15  # Assuming 15 FPS, adjust as needed
    video_writer = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    
    # Add "CIGARETTE DETECTED" text to video
    font = cv2.FONT_HERSHEY_SIMPLEX
    
    # Write each frame to the video
    for i, frame in enumerate(frames):
        # Add timestamp overlay on frame
        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(frame, timestamp_str, (10, frame.shape[0] - 10), font, 0.5, (255, 255, 255), 1)
        
        # Add anomaly text if this frame contains a cigarette detection
        if i in detection_frames:
            cv2.rectangle(frame, (0, 0), (frame.shape[1], 40), (0, 0, 0), -1)
            cv2.putText(frame, "ANOMALY DETECTED: SMOKING", (10, 30), font, 0.8, (0, 0, 255), 2)
        
        video_writer.write(frame)
    
    # Release the video writer
    video_writer.release()
    print(f"Saved batch {batch_id} as video: {video_path}")
    
    # Create log entry
    log_entry = (f"Cigarette Detection - Batch #{batch_id}\n"
                f"Video: {video_path}\n"
                f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
                f"Frames with cigarettes: {len(detection_frames)}/{len(frames)}\n"
                f"{'='*50}\n")
    
    # Write log to file
    with open("cigarette_detection_log.txt", "a") as log_file:
        log_file.write(log_entry)

try:
    while True:
        msg = consumer.poll(1.0)
        
        if msg is None:
            # Check for timed-out batches
            current_time = time.time()
            for batch_id in list(batches.keys()):
                if current_time - batches[batch_id]['last_update'] > BATCH_TIMEOUT:
                  #  print(f"Batch {batch_id} timed out. Received {batches[batch_id]['received_chunks']} of {batches[batch_id]['total_chunks']} chunks.")
                    del batches[batch_id]
            continue
        
        if msg.error():
            print(f"Consumer error: {msg.error()}")
            continue
        
        # Decompress the message
        try:
            compressed_data = msg.value()
            json_data = zlib.decompress(compressed_data)
            chunk = json.loads(json_data.decode('utf-8'))
        except Exception as e:
            print(f"Error decoding message: {e}")
            continue
        
        # Extract batch information
        batch_id = chunk['batch_id']
        chunk_number = chunk['chunk_number']
        total_chunks = chunk['total_chunks']
        
        # Initialize or update batch tracking
        if batch_id not in batches:
            batches[batch_id] = {
                'chunks': {},
                'total_chunks': total_chunks,
                'received_chunks': 0,
                'last_update': time.time(),
                'collection_interval': chunk['collection_interval']
            }
            print(f"Started receiving new batch {batch_id}")
        
        # Store this chunk
        if chunk_number not in batches[batch_id]['chunks']:
            batches[batch_id]['chunks'][chunk_number] = chunk['frames']
            batches[batch_id]['received_chunks'] += 1
            batches[batch_id]['last_update'] = time.time()
            
            print(f"Received chunk {chunk_number}/{total_chunks} for batch {batch_id}")
        
        # If we have all chunks for this batch, process it
        if batches[batch_id]['received_chunks'] == total_chunks:
            print(f"Complete batch {batch_id} received! Processing...")
            
            # Combine all frames from all chunks in order
            all_frames_b64 = []
            for i in range(1, total_chunks + 1):
                all_frames_b64.extend(batches[batch_id]['chunks'][i])
            
            #print(f"Processing {len(all_frames_b64)} frames from batch {batch_id}")
            
            # Decode all frames and run detection
            decoded_frames = []
            annotated_frames = []
            detection_frames = []  # Indices of frames with cigarette detections
            
            for frame_idx, frame_b64 in enumerate(all_frames_b64):
                # Decode the base64 frame
                try:
                    img_bytes = base64.b64decode(frame_b64)
                    np_arr = np.frombuffer(img_bytes, np.uint8)
                    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                    
                    if frame is None:
                        print(f"Warning: Failed to decode frame {frame_idx}")
                        continue
                    
                    # Run cigarette detection on the frame
                    is_cigarette, confidence, annotated_frame = detect_cigarette(frame)
                    
                    # Save this frame
                    decoded_frames.append(frame)
                    annotated_frames.append(annotated_frame)
                    
                    # If cigarette detected, save the frame separately
                    if is_cigarette:
                        detection_frames.append(frame_idx)
                        save_detection_frame(annotated_frame, batch_id, frame_idx, confidence)
                        print(f"Cigarette detected in frame {frame_idx} with confidence {confidence:.2f}")
                    
                except Exception as e:
                    print(f"Error processing frame {frame_idx}: {e}")
            
            # If any cigarettes were detected in this batch, save the entire batch as a video
            if detection_frames:
                print(f"Batch {batch_id}: Detected cigarettes in {len(detection_frames)} frames. Saving batch as video.")
                save_batch_as_video(annotated_frames, batch_id, detection_frames)
            else:
                print(f"Batch {batch_id}: No cigarettes detected in this batch.")
            
            # Commit offsets manually after processing the batch
            consumer.commit(asynchronous=False)
            
            # Remove this batch from tracking
            del batches[batch_id]
            print(f"Finished processing batch {batch_id}")
        
except KeyboardInterrupt:
    print("Stopping consumer")

finally:
    consumer.close()
    cv2.destroyAllWindows()