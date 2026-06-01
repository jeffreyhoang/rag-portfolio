# Human Motion Reconstruction Pipeline

**Summary:** An end-to-end human motion capture and reconstruction pipeline combining multi-camera hardware automation, deep learning pose estimation, and physics-based biomechanical modeling.
**Tech Stack:** Python, TensorFlow, MuJoCo, MediaPipe, OpenGoPro API, NumPy, Librosa, FFmpeg, Human3.6M dataset, NVIDIA A100, HPC clusters
**Context:** Computational Intelligence Lab — Cal Poly Pomona · Supervisor: Dr. Hao Ji, Ph.D.

## What I Built

- Web-based automation tools and REST APIs to control multi-camera GoPro recording setups over USB, Bluetooth Low Energy, and Wi-Fi using the OpenGoPro API
- Audio-based multi-camera synchronization system using Librosa, FFmpeg, and NumPy to automate temporal alignment, eliminating frame offset errors
- Automated end-to-end computer vision pipeline: intrinsic and extrinsic camera calibration, multi-view video preprocessing, 2D keypoint detection, and 3D pose reconstruction
- Trained deep neural networks for 3D keypoint detection on the Human3.6M dataset using TensorFlow on NVIDIA A100 GPUs across HPC clusters
- Physics-based post-processing pipeline fitting Metrabs 3D keypoint predictions to biomechanical LocoMuJoCo models using forward kinematics and optimization to estimate joint angles and body scaling parameters

## Outcome

Produced anatomically consistent and physically accurate 3D human pose alignments suitable for downstream biomechanics analysis and simulation. Presented research at the Creative Activities and Research Symposium (CARS) at Cal Poly Pomona.
