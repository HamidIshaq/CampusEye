import cv2
import torch
from ultralytics import YOLO
from flask import Flask, Response
import argparse
import time
from datetime import datetime
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from pymongo import MongoClient
import os
import threading

# Flask app initialization
app = Flask(__name__)

# Global variables
output_frame = None
lock = threading.Lock()

# MongoDB setup (initialize once in your script)
mongo_client = MongoClient("mongodb://127.0.0.1:27017/")
db = mongo_client["campus-eye"]
anomalies_collection = db["anomalies"]

# Email configuration (use app password)
EMAIL_SENDER = 'study.binarybeats@gmail.com'
EMAIL_PASSWORD = 'lagamgdkuulgzcfp'  # App password, not your regular password
EMAIL_RECEIVER = 'hamidishaq476@gmail.com'

def send_email(camera_id, timestamp, video_path):
    try:
        subject = f"Anomaly Alert: Smoking Detected on Camera {camera_id} ({timestamp})"

        # Plain text fallback
        plain_text = f"""
Anomaly Alert

An anomaly (smoking) was detected.

Details:
- Camera ID: {camera_id}
- Timestamp: {timestamp}

Please review the attached video clip.

This is a computer-generated message. Please do not reply.

Regards,
CampusView AI Surveillance System
FAST-NUCES
"""

        # Rich HTML content
        html_content = f"""
        <html>
          <body>
            <h2>🚨 Smoking Anomaly Detected</h2>
            <p>
              <strong>Camera ID:</strong> {camera_id}<br>
              <strong>Timestamp:</strong> {timestamp}<br><br>
              An anomaly was detected by the CampusView AI Surveillance System.
            </p>
            <p>Please find the attached video for further review and action.</p>
            <br>
            <hr>
            <p style="font-size: 0.9em;">
              Regards,<br>
              <strong>CampusView AI Surveillance System</strong><br>
              FAST-NUCES<br><br>
              <em>This is a computer-generated message. Please do not reply.</em>
            </p>
          </body>
        </html>
        """

        # Compose message
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = formataddr(('CampusView Surveillance', EMAIL_SENDER))
        msg['To'] = EMAIL_RECEIVER

        msg.set_content(plain_text)
        msg.add_alternative(html_content, subtype='html')

        # Attach video file
        if video_path and os.path.exists(video_path):
            with open(video_path, 'rb') as f:
                file_data = f.read()
                msg.add_attachment(
                    file_data,
                    maintype='video',
                    subtype='mp4' if video_path.endswith('.mp4') else 'x-msvideo',
                    filename=os.path.basename(video_path)
                )

        # Send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(msg)

        print(f"[✅ EMAIL SENT] Anomaly video from Camera {camera_id} ({timestamp})")

    except Exception as e:
        print(f"[❌ EMAIL ERROR] {e}")


def detect_smoking_realtime(model_path, conf_threshold=0.7, cam_source=0, camera_id="Cam-1"):
    global output_frame, lock

    try:
        model = YOLO(model_path)
    except Exception as e:
        print(f"[MODEL LOAD ERROR] {e}")
        return

    cap = cv2.VideoCapture(cam_source)
    if not cap.isOpened():
        print("[CAMERA ERROR] Cannot open camera")
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    font = cv2.FONT_HERSHEY_SIMPLEX
    start_time = time.time()
    frame_count = 0
    smoking_frames = 0
    max_smoking_frames = 10
    buffer_size = 30
    min_anomaly_duration = 5

    frame_buffer = []
    anomaly_start_time = None
    anomaly_count = 0
    anomaly_duration = 0
    recording = False
    video_writer = None
    video_filename = ""

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        elapsed_time = time.time() - start_time
        fps = frame_count / elapsed_time if elapsed_time > 0 else 0

        try:
            results = model(frame, conf=conf_threshold)[0]
        except Exception as e:
            print(f"[INFERENCE ERROR] {e}")
            continue

        smoking_detected = False
        for detection in results.boxes.data.tolist():
            x1, y1, x2, y2, confidence, class_id = detection
            if int(class_id) == 1:  # Assuming 1 = cigarette/smoking class
                smoking_detected = True
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                label = f"Smoking: {confidence:.2f}"
                cv2.putText(frame, label, (int(x1), int(y1) - 10), font, 0.5, (0, 0, 255), 2)

        if len(frame_buffer) >= buffer_size:
            frame_buffer.pop(0)
        frame_buffer.append(frame.copy())

        smoking_frames = smoking_frames + 1 if smoking_detected else max(0, smoking_frames - 1)
        active_smoking = smoking_frames >= max_smoking_frames

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        status = "ANOMALY DETECTED: SMOKING" if active_smoking else "NO ANOMALY"
        color = (0, 0, 255) if active_smoking else (0, 255, 0)

        cv2.rectangle(frame, (0, 0), (frame.shape[1], 40), (0, 0, 0), -1)
        cv2.putText(frame, status, (10, 30), font, 0.7, color, 2)
        cv2.putText(frame, f"FPS: {fps:.1f}", (frame.shape[1] - 120, 30), font, 0.6, (255, 255, 255), 2)
        cv2.putText(frame, timestamp, (10, frame.shape[0] - 10), font, 0.5, (255, 255, 255), 1)

        current_time = time.time()

        if active_smoking and anomaly_start_time is None:
            anomaly_start_time = current_time

        if anomaly_start_time:
            if active_smoking:
                anomaly_duration = current_time - anomaly_start_time
                if not recording and anomaly_duration >= 2:
                    h, w = frame.shape[:2]
                    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                    timestamp_str = datetime.fromtimestamp(anomaly_start_time).strftime("%Y%m%d_%H%M%S")
                    video_filename = f"anomaly_{timestamp_str}.mp4"
                    video_writer = cv2.VideoWriter(video_filename, fourcc, fps, (w, h))
                    recording = True
                    for fbuf in frame_buffer:
                        video_writer.write(fbuf)
                    print(f"[RECORDING STARTED] {video_filename}")
                if recording:
                    video_writer.write(frame)
            else:
                if recording:
                    video_writer.release()
                    recording = False
                    if anomaly_duration >= min_anomaly_duration:
                        anomaly_count += 1
                        start_str = datetime.fromtimestamp(anomaly_start_time).strftime("%Y-%m-%d %H:%M:%S")
                        end_str = datetime.fromtimestamp(current_time).strftime("%Y-%m-%d %H:%M:%S")

                        video_relative_path = os.path.relpath(video_filename, start="C:/Users/Hamid Ashaq/OneDrive/Documents/Semester8/FYP-II/Smoking Detection/CampusViewApp/backend/stored_anomalies/")

                        anomaly_data = {
                            "anomaly_number": anomaly_count,
                            "camera_id": camera_id,
                            "start_time": start_str,
                            "end_time": end_str,
                            "duration": round(anomaly_duration, 2),
                            "video_path": video_relative_path.replace("\\", "/"),  # For front-end usage
                            "anomaly_type": "Smoking",
                            "emailed": True,
                            "logged_at": datetime.utcnow()
                        }

                        try:
                            anomalies_collection.insert_one(anomaly_data)
                            print(f"[ANOMALY LOGGED TO DB] {video_relative_path}")
                        except Exception as e:
                            print(f"[DB LOGGING ERROR] {e}")

                        # Send email
                        send_email(camera_id=camera_id, timestamp=start_str, video_path=video_filename)
                    else:
                        os.remove(video_filename)
                        print(f"[ANOMALY TOO SHORT] Discarded {video_filename}")
                anomaly_start_time = None
                anomaly_duration = 0

        with lock:
            output_frame = frame.copy()

    if video_writer:
        video_writer.release()
    cap.release()
    cv2.destroyAllWindows()

def generate_stream():
    global output_frame, lock
    while True:
        with lock:
            if output_frame is None:
                continue
            ret, buffer = cv2.imencode('.jpg', output_frame)
            if not ret:
                continue
            frame = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def stream_feed():
    return Response(generate_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

def start_flask_server():
    app.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, default='C:/Users/Hamid Ashaq/OneDrive/Documents/Semester8/FYP-II/Smoking Detection/smoking_detection_model/weights/best.pt', help='Path to YOLO model')
    parser.add_argument('--conf', type=float, default=0.4, help='Confidence threshold')
    parser.add_argument('--source', type=int, default=0, help='Camera source index')
    parser.add_argument('--camera_id', type=str, default="Cam-1", help='Camera Identifier')
    args = parser.parse_args()

    threading.Thread(target=start_flask_server, daemon=True).start()
    detect_smoking_realtime(args.model, args.conf, args.source, args.camera_id)

if __name__ == '__main__':
    main()
