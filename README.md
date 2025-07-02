# CampusEye: Distributed Anomaly Detection System

## Overview
CampusEye is an intelligent, distributed anomaly detection system designed for real-time monitoring of environments such as campuses. It detects and reports critical anomalies like **Smoking**, **Fighting**, and **Vandalism** using advanced computer vision models, distributed training, and real-time alerting.

## Architecture
CampusEye is composed of three main components:

### 1. Frontend (React UI)
- Built with React (located in `frontend/`).
- Provides an intuitive dashboard for monitoring live video feeds, viewing detected anomalies, and managing system settings.
- Allows users to review stored anomaly clips and their metadata.

### 2. Backend (Python APIs & Detection)
- Located in `backend/`.
- Contains Python scripts and REST APIs for:
  - Running anomaly detection models on video feeds.
  - Storing detected anomaly video clips locally.
  - Logging timestamps and video references in MongoDB.
  - Sending alerts (with video clips and timestamps) to relevant authorities upon detection.
- Supports distributed model training and inference using federated training.

### 3. Node.js Server (Integration Layer)
- Located at the project root (`server.js`).
- Connects the React frontend, Python backend, and MongoDB database.
- Handles API routing, authentication, and communication between components.

## Distributed Computing & Federated Learning
- **Federated Training:** The system utilizes distributed computing to train the anomaly detection model collaboratively across multiple nodes, improving privacy and scalability.
- **Model Broadcasting:** After training, the master node broadcasts the trained model to all connected slave nodes.
- **Live Inference:** Slave nodes apply the model to live video feeds and send inference results back to the master.
- **Kafka Integration:**
  - **Producer (Master):** Orchestrates training, model distribution, and result aggregation.
  - **Consumer (Slave):** Receives models, performs inference, and returns results.

## Data Storage & Alerting
- **Anomaly Storage:** Detected anomaly video clips are stored locally in `backend/stored_anomalies/`.
- **Database Logging:** Each anomaly's timestamp and video location are stored in MongoDB for easy retrieval and auditing.
- **Alert System:** When an anomaly is detected, an alert (with the video clip and timestamp) is automatically sent to the relevant authorities.

## Getting Started
1. **Install Dependencies**
   - Frontend: `cd frontend && npm install`
   - Backend: Set up Python environment and install required packages (see `backend/requirements.txt` if available).
   - Root: `npm install` (for Node.js server)
2. **Configure MongoDB**
   - Ensure MongoDB is running and update connection strings as needed.
3. **Run the System**
   - Start backend Python APIs.
   - Start Node.js server.
   - Start React frontend.
4. **Distributed Setup**
   - Configure Kafka brokers and topics for master-slave communication.
   - Launch master and slave nodes as per your deployment.

## Features
- Real-time anomaly detection (Smoking, Fighting, Vandalism)
- Distributed, federated model training and inference
- Local storage of anomaly video clips
- MongoDB-based anomaly metadata logging
- Automated alerting with video evidence
- Scalable, modular architecture

## Technologies Used
- **Frontend:** React, Tailwind CSS
- **Backend:** Python, OpenCV, PyTorch, Flask/FastAPI
- **Integration:** Node.js, Express
- **Database:** MongoDB
- **Distributed Computing:** Apache Kafka

## Folder Structure
- `frontend/` - React UI
- `backend/` - Python detection scripts, APIs, and stored anomalies
- `models/` - Data models (e.g., User, Anomaly)
- `routes/` - API route definitions
- `server.js` - Node.js integration server

## Anomaly Detection Model & Training
The `anomaly_detection_model/` folder contains all resources related to model training and evaluation:
- **Jupyter Notebook:** `smoker-detection-system.ipynb` contains the code for training and evaluating the anomaly detection model.
- **Model Weights:** Pretrained and trained weights (e.g., `best.pt`, `yolo11n.pt`, `yolov8s.pt`, and `weights/` folder) for use in inference and further training.
- **Training Metrics & Results:** Includes confusion matrices, F1/PR/P/R curves, label visualizations, and training result images for performance analysis.
- **Training Logs & Configs:** YAML configuration files and TensorBoard event logs for reproducibility and experiment tracking.
- **Sample Batches:** Example images from training and validation batches for qualitative assessment.

This folder enables reproducibility and transparency for the model development process, and can be used to retrain or fine-tune the detection model as needed.

## License
This project is for academic and research purposes.

## 🧑‍💻 Authors & Contributors
Hamid Ishaq – Lead Developer

Muhammad Abdullah – Developer

Muhammad Hasaam – Developer

## 📬 Questions or Support?
Feel free to raise an issue or reach out for collaboration opportunities!

