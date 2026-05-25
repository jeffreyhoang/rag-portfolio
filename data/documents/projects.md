# Projects

## RAG Portfolio Assistant
*Python · FastAPI · LangChain · ChromaDB · OpenAI API · React · Tailwind CSS*
*Deployed: Railway (backend) · Vercel (frontend)*

Built a production-deployed personal AI assistant that lives on this
portfolio website and allows recruiters and hiring managers to ask
natural language questions and receive grounded, cited answers pulled
directly from resume documents, project writeups, and a curated
knowledge base.

The system is built on a full retrieval-augmented generation pipeline
consisting of five independent services: a document loader and chunker
that preprocesses markdown and PDF files using recursive character
splitting with configurable overlap, an OpenAI embedding service that
converts document chunks into vector representations in batches, a
ChromaDB vector store with cosine similarity search for top-k
retrieval, a cross-encoder reranker using the ms-marco-MiniLM-L-6-v2
model to rescore and filter retrieved chunks down to the most relevant
passages, and a generation service that assembles a grounded prompt
with numbered citations and calls the OpenAI chat completions API.

Retrieval quality is enhanced through hybrid search combining dense
vector retrieval with BM25 keyword search merged via Reciprocal Rank
Fusion, ensuring strong performance on both semantic and exact-match
queries. The system supports multi-turn conversation through a sliding
window memory that maintains the last ten turns of context. Every
component is evaluated using the ragas framework measuring
faithfulness, answer relevancy, context precision, and context recall.

The backend is fully tested with pytest, all external API calls are
mocked, and the application is deployed with environment-based
configuration using pydantic-settings. This project was built
independently to demonstrate production-quality AI engineering without
relying on an internship or external guidance.

Technologies: Python, FastAPI, LangChain, ChromaDB, Pinecone,
OpenAI API, sentence-transformers, rank-bm25, ragas, React,
Tailwind CSS, Railway, Vercel.

---

## Human Motion Reconstruction Pipeline
*Python · TensorFlow · MuJoCo · MediaPipe · OpenGoPro API · NumPy · Librosa · FFmpeg*
*Computational Intelligence Lab — Cal Poly Pomona · Supervisor: Dr. Hao Ji, Ph.D.*

Developed a full end-to-end human motion capture and reconstruction
pipeline as part of a two-year research engagement at the
Computational Intelligence Lab, spanning multi-camera hardware
automation, deep learning-based pose estimation, physics-based
biomechanical modeling, and scalable experimentation infrastructure.

Designed and built web-based automation tools and REST APIs to control
multi-camera GoPro recording setups over USB, Bluetooth Low Energy,
and Wi-Fi using Python and the OpenGoPro API, significantly increasing
data collection efficiency and removing manual overhead from multi-view
recording sessions. Implemented a robust audio-based multi-camera
synchronization system using Librosa, FFmpeg, and NumPy to automate
temporal alignment across all camera streams, directly improving the
accuracy of downstream three-dimensional pose reconstruction by
eliminating frame offset errors.

Conducted a structured review of academic literature on multi-view
geometry and markerless human pose estimation to inform system design
and modeling choices. Built an automated end-to-end computer vision
pipeline covering intrinsic and extrinsic camera calibration,
multi-view video preprocessing, two-dimensional keypoint detection,
and three-dimensional pose reconstruction — enabling fully scalable
and repeatable experimentation across recording sessions without
manual intervention.

Trained deep neural networks for three-dimensional keypoint detection
on the Human3.6M dataset using TensorFlow on NVIDIA A100 GPUs across
high-performance computing clusters, applying batch normalization,
ReLU activation, dropout, and linear layer architectures to improve
model accuracy and generalization across unseen human poses. Developed
a physics-based post-processing pipeline that fitted Metrabs
three-dimensional keypoint predictions to biomechanical LocoMuJoCo
models using forward kinematics and optimization techniques to estimate
joint angles and body scaling parameters, producing anatomically
consistent and physically accurate three-dimensional human pose
alignments suitable for downstream biomechanics analysis and
simulation.

Presented research methodology and experimental results at the
Creative Activities and Research Symposium (CARS) at Cal Poly Pomona,
clearly communicating complex machine learning and computer vision
concepts to an audience of peers and faculty and incorporating
feedback to guide the next phase of development.

Technologies: Python, TensorFlow, MuJoCo, MediaPipe, OpenGoPro API,
NumPy, Librosa, FFmpeg, Human3.6M dataset, NVIDIA A100, HPC clusters,
multi-view geometry, forward kinematics, camera calibration.

---

## ASL Real-Time Recognition System
*Python · PyTorch · MediaPipe · BiLSTM · Transformer · OpenAI API*
*SJSU CMPE 257 — Graduate Coursework*

Built a real-time American Sign Language recognition system that
translates hand gestures captured from a webcam into coherent English
text, combining keypoint-based feature extraction, temporal deep
learning, sliding window inference, and large language model
post-processing into a single end-to-end pipeline aimed at reducing
communication barriers for the deaf and hard-of-hearing community.

The system uses MediaPipe Hands to extract 21 three-dimensional hand
landmarks per hand per frame across two hands, producing a compact
126-dimensional skeletal feature vector per frame that avoids raw
pixel processing entirely. Each frame is normalized by centering
keypoints at the wrist and scaling by the wrist-to-middle-finger
distance to ensure consistency across position and scale variations.
Frame-to-frame motion features are appended by computing the
difference between consecutive frames, extending the input
dimensionality from 126 to 252 features per frame to capture temporal
dynamics that static pose vectors alone cannot represent.

The WLASL dataset was filtered from over 21,000 videos spanning 2,000
sign classes down to 668 videos across 50 classes by removing
inaccessible samples and restricting to classes with sufficient
training examples. A sliding window sequence generation strategy
expanded the dataset from 668 source videos to approximately 30,000
training samples. Offline augmentation applied horizontal flips,
temporal jitter, and Gaussian noise to further diversify training
data. Online augmentation during training applied random scaling,
spatial shifting, frame dropping, and speed jitter to improve
robustness to real-world variation in signing style and speed.

Two temporal deep learning architectures were implemented and
evaluated in PyTorch. The BiLSTM processes input sequences
bidirectionally through two layers with a hidden size of 128 and
a dropout rate of 0.5, capturing both past and future context at
each timestep. Temporal attention pooling assigns learned weights
to each timestep and computes a weighted sum over hidden states,
enabling the model to focus on the most discriminative frames
rather than relying on the final hidden state alone. The Transformer
architecture projects input sequences into a 512-dimensional embedding
space, adds learnable positional embeddings, and processes all frames
in parallel through two encoder layers with four attention heads
each, using a Pre-LayerNorm configuration for improved training
stability.

Both models were trained for up to 80 epochs with early stopping,
the Adam optimizer with cosine learning rate decay, class-weighted
cross-entropy loss, label smoothing of 0.15, and sequence-level
MixUp regularization. The BiLSTM achieved 73.0 percent top-1 test
accuracy with an inference latency of 1.25 milliseconds per window
and throughput of 800 windows per second on CPU. The Transformer
achieved 69.9 percent accuracy with a latency of 1.95 milliseconds
and 512 windows per second. Both models substantially exceeded the
pose-only WLASL state-of-the-art benchmark of approximately 55 to
60 percent accuracy. The BiLSTM was selected as the production model
based on its higher accuracy and 5.4 million fewer parameters.

Continuous sign recognition is performed using a sliding window
mechanism with a sequence length of 30 and a stride of 5, producing
overlapping predictions from a live webcam stream. A stability
mechanism applies a confidence threshold of 0.5 and a repetition
filter requiring five consecutive high-confidence predictions before
appending a word to the output, reducing noise and improving phrase
coherency. OpenAI's gpt-4.1-nano refines the final raw gloss sequence
into grammatically correct English using constrained prompt engineering
that preserves original meaning without introducing new vocabulary.

Personal contributions included contributing to the BiLSTM
architecture implementation in PyTorch, implementing the real-time
sliding window inference pipeline, applying confidence and repetition
filtering for continuous sign recognition, and implementing LLM
post-processing using the OpenAI API.

Technologies: Python, PyTorch, MediaPipe, BiLSTM, Transformer,
OpenAI API, NumPy, WLASL dataset, Google Colab T4 GPU.

---

## Multimodal Sentiment Analysis
*Python · PyTorch · BERT · ResNet-18 · Multimodal Fusion*
*SJSU CMPE 252 — Graduate Coursework*

Designed and implemented a multimodal sentiment analysis system
that classifies the emotional tone of Twitter posts by combining
textual and visual information, evaluating whether multimodal fusion
improves performance over unimodal text-only and image-only baselines.

The system uses a pretrained BERT base model to extract 768-dimensional
contextual text embeddings from tokenized tweet captions, and a
pretrained ResNet-18 model fine-tuned on the last two convolutional
blocks to extract 512-dimensional visual feature embeddings from
accompanying images. Both encoders were adapted to the sentiment
classification task using the MVSA-Single dataset containing 2,592
cleaned Twitter image-text pairs labeled as positive, neutral, or
negative after filtering inconsistent samples from an original 4,869.

Led the design and implementation of four multimodal fusion
architectures. Score-level fusion combines independently computed
text and image logits through a learned weighted sum. Embedding-level
fusion concatenates projected feature embeddings into a shared 256-
dimensional latent space before classification. Scalar-gated fusion
applies a single learned gating scalar to determine the relative
contribution of each modality. Vector-gated fusion learns a
feature-wise gating vector that assigns modality importance
independently across every feature dimension, enabling more adaptive
cross-modal integration.

Score-level fusion and vector-gated fusion achieved the highest
accuracy of 79.43 percent, outperforming the text-only baseline of
77.38 percent and the image-only baseline of 65.04 percent. Vector-
gated fusion achieved the highest precision of 79.66 percent and
produced the most balanced modality weighting with a text weight of
0.54 and image weight of 0.46, demonstrating stronger adaptive fusion
behavior compared to other methods. Score-level fusion achieved the
highest F1 score of 75.06 percent, indicating the best overall balance
between precision and recall. All multimodal models consistently
outperformed unimodal baselines, confirming that visual features
provide complementary information when combined with text even when
one modality dominates.

Technologies: Python, PyTorch, BERT, ResNet-18, MVSA-Single dataset,
multimodal fusion, AdamW, macro F1 evaluation.

---

## ResumeAI
*React · Vite · Tailwind CSS · Python · Flask · OpenAI API · WeasyPrint*

Built a full-stack AI-powered resume builder that allows users to
input their personal information, education, experience, publications,
projects, and skills and instantly view their qualifications rendered
in a professional resume layout, with AI-powered recommendations for
refinement and one-click export to PDF.

The frontend is built with React, Vite, and Tailwind CSS, providing
a responsive real-time editing interface where changes to any section
immediately update the live resume preview. The backend is built with
Python and Flask, using WeasyPrint for high-fidelity PDF generation
that preserves professional formatting and layout. The OpenAI API
powers the AI recommendation engine, analyzing the user's resume
content and returning targeted suggestions for improving phrasing,
highlighting impact, and tailoring content for specific roles. All
API keys are managed through environment variables using python-dotenv
and are never hardcoded.

The application is available as a live demo and a video walkthrough
is publicly accessible. The full codebase is available on GitHub.

Technologies: React, Vite, Tailwind CSS, Python, Flask, OpenAI API,
WeasyPrint, python-dotenv.