---
title: "Building a Real-Time Multi-User Face Recognition System Using LBPH"
publishedAt: "2026-01-28"
summary: "How I built a real-time multi-user face recognition system in C++ using OpenCV, Haar Cascade for detection, and LBPH for recognition."
tags: ["Computer Vision", "C++", "OpenCV", "Face Recognition", "AI"]
---

## Design and Implementation of a Real-Time Multi-User Face Recognition System Using LBPH

Face recognition is one of the most practical and challenging applications of computer vision.  
Instead of relying on high-level frameworks, I wanted to understand **how face recognition systems work at a lower level**, using classical computer vision techniques.

This project implements a **real-time, multi-user face recognition system** using **C++ and OpenCV**, designed to be clean, extensible, and suitable for academic and portfolio use.

---

## Project Goals

The main objectives of this project were:

- Build a real-time face recognition system from scratch
- Support multiple users
- Use a classical, explainable algorithm
- Keep the system privacy-safe and reproducible
- Design it in a way that can be extended later

---

## Technologies Used

- **C++**
- **OpenCV 4.x**
- **OpenCV Contrib (face module)**
- **Haar Cascade Classifier** (face detection)
- **LBPH (Local Binary Patterns Histogram)** (face recognition)
- **CMake**
- **Visual Studio (Windows)**

---

## System Overview

The system consists of two main stages:

1. **Face Training**
2. **Real-Time Face Recognition**

Both stages operate using a webcam and process frames in real time.

---

## Face Detection with Haar Cascade

Face detection is handled using a **Haar Cascade classifier**, which scans each frame and identifies face regions.

Why Haar Cascade?
- Fast enough for real-time use
- Lightweight
- Well-supported in OpenCV
- Ideal for controlled environments

Each detected face is converted to grayscale and resized before further processing.

---

## Face Recognition Using LBPH

For recognition, I used **LBPH (Local Binary Patterns Histogram)**.

### Why LBPH?
- Works well with small datasets
- Robust to lighting changes
- Easy to train incrementally
- Interpretable and efficient

### How it works (conceptually)
- Converts facial features into binary patterns
- Builds histograms for face regions
- Compares histograms to recognize identities

Each user is assigned a unique label, and the trained LBPH model maps detected faces to those labels during recognition.

---

## Training Pipeline

The training process is interactive:

1. User runs the training executable
2. Webcam opens
3. Multiple face samples are captured
4. Images are stored locally in a structured dataset
5. The LBPH model is trained and saved

No face images are included in the repository, ensuring **privacy and security**.

---

## Dataset Organization

data/
├── haarcascade_frontalface_default.xml
└── dataset/
└── user_X/
├── img1.jpg
├── img2.jpg
└── ...

- Each user has a separate folder
- Labels are derived automatically
- Dataset is generated at runtime

---

## Real-Time Recognition

During recognition:
- Webcam captures frames continuously
- Faces are detected in each frame
- LBPH model predicts the identity
- Results are displayed in real time

This allows multiple trained users to be recognized instantly.

---

## Build System and Project Structure

The project uses **CMake** for portability and clean builds.

FaceRecognitionApp/
│-- CMakeLists.txt
│-- src/
│ ├── train.cpp
│ └── recognize.cpp
│
├── data/
│ ├── haarcascade_frontalface_default.xml
│ └── dataset/
│
└── README.txt
Build artifacts and datasets are excluded from version control.

---

## Common Issues and Debugging

While building this system, I encountered common real-world issues:

### Haar Cascade Not Found
- Ensured correct relative paths
- Verified runtime working directory

### OpenCV DLL Errors
- Fixed by correctly adding OpenCV binaries to PATH

### Camera Access Issues
- Verified permissions and camera index

Handling these issues reinforced the importance of environment setup in computer vision projects.

---

## What This Project Taught Me

This project helped me understand:

- The full pipeline of face recognition systems
- Tradeoffs between classical and deep-learning approaches
- Real-time computer vision constraints
- Importance of clean dataset design
- Practical debugging in C++ and OpenCV

It also strengthened my confidence in working close to the hardware and system level.

---

## Future Improvements

Some planned extensions include:

- CNN-based face recognition (FaceNet / ArcFace)
- Better robustness to pose and lighting
- Cross-platform support
- Model persistence and evaluation metrics

---

## Final Thoughts

While modern deep-learning models dominate face recognition today, classical methods like LBPH are still incredibly valuable for learning, prototyping, and constrained environments.

Building this system from scratch gave me a solid foundation in **computer vision, C++, and real-time system design** — and it’s a project I’m proud to include in my portfolio.
