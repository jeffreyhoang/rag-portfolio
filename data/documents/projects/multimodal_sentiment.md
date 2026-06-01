# Multimodal Sentiment Analysis

**Summary:** A multimodal sentiment analysis system classifying Twitter posts by combining text and image information, evaluating whether fusion improves over unimodal baselines.
**Tech Stack:** Python, PyTorch, BERT, ResNet-18, MVSA-Single dataset, AdamW, macro F1 evaluation
**Context:** SJSU CMPE 252 — Graduate Coursework

## What I Built

- Pretrained BERT base model extracting 768-dimensional contextual text embeddings
- Pretrained ResNet-18 fine-tuned on the last two convolutional blocks extracting 512-dimensional visual embeddings
- MVSA-Single dataset: 2,592 cleaned Twitter image-text pairs (positive, neutral, negative)

## Four Fusion Architectures

- **Score-level fusion:** Combines text and image logits through a learned weighted sum
- **Embedding-level fusion:** Concatenates projected embeddings into a shared 256-dimensional latent space
- **Scalar-gated fusion:** Single learned scalar controlling relative modality contribution
- **Vector-gated fusion:** Feature-wise gating vector assigning modality importance across every feature dimension

## Results

| Model | Accuracy | Notes |
|---|---|---|
| Text-only baseline | 77.38% | — |
| Image-only baseline | 65.04% | — |
| Score-level fusion | 79.43% | Highest F1: 75.06% |
| Vector-gated fusion | 79.43% | Highest precision: 79.66%, most balanced modality weighting |

All multimodal models consistently outperformed unimodal baselines. Vector-gated fusion showed the strongest adaptive fusion behavior (text weight 0.54, image weight 0.46).
