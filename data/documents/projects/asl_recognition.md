# ASL Real-Time Recognition System

**Summary:** A real-time American Sign Language recognition system that translates webcam hand gestures into coherent English text using deep learning and LLM post-processing.
**Tech Stack:** Python, PyTorch, MediaPipe, BiLSTM, Transformer, OpenAI API, NumPy, WLASL dataset, Google Colab T4 GPU
**Context:** SJSU CMPE 257 — Graduate Coursework

## What I Built

- MediaPipe Hands extracts 21 3D hand landmarks per hand per frame, producing a 126-dimensional skeletal feature vector per frame
- Frame normalization by centering at the wrist and scaling by wrist-to-middle-finger distance for position and scale consistency
- Frame-to-frame motion features extending input from 126 to 252 dimensions to capture temporal dynamics
- WLASL dataset filtered to 668 videos across 50 classes; sliding window strategy expanded to ~30,000 training samples
- Two temporal architectures implemented and evaluated in PyTorch:
  - **BiLSTM:** Two bidirectional layers, hidden size 128, dropout 0.5, temporal attention pooling
  - **Transformer:** 512-dimensional embeddings, two encoder layers, four attention heads, Pre-LayerNorm

## Results

| Model | Accuracy | Latency | Throughput |
|---|---|---|---|
| BiLSTM | 73.0% | 1.25ms/window | 800 windows/sec |
| Transformer | 69.9% | 1.95ms/window | 512 windows/sec |

Both models exceeded the pose-only WLASL state-of-the-art benchmark of ~55–60%. BiLSTM selected as production model.

## Real-Time Inference

Sliding window with sequence length 30 and stride 5. Stability mechanism applies a 0.5 confidence threshold and requires five consecutive high-confidence predictions before appending a word. OpenAI gpt-4.1-nano refines raw gloss into grammatically correct English.

## My Contributions

BiLSTM architecture implementation, real-time sliding window inference pipeline, confidence and repetition filtering, LLM post-processing via OpenAI API.
