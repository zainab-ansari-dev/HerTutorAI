# HerTutorAI 🎓

> **Built for a friend who asked for an easy way to organize learning resources, lecture breakdowns, and curated YouTube videos in one place.**

HerTutorAI is an offline-capable, multimodal academic study assistant created for **Hacktoberfest DEV Challenge 'Build for a Friend'**. It combines local LLM inference, pre-computed UI card rendering, and automated YouTube video curation into a fast, privacy-first learning hub.

## Why I built this
I built this for my friend who keeps asking me for youtube video recommendations and notes or references for our semester examinations topics. now she can just enter the topic (from our 5th semester syllabus) and get explanation and recommended video on that topic, it also provides references , from where to study the topic.

## Problem it solved:
**1. Eliminates "Search Fatigue":** Instead of searching YouTube blindly,my friend enters a syllabus prompt or uploads a lecture diagram. HerTutorAI parses the core concept and automatically matches it with curated, relevant educational video resources.

**2. Multimodal Diagram Analysis:** If a lecture slide or textbook diagram is confusing, they can drop the image directly into the chatbot to get a step-by-step breakdown alongside matching lecture video recommendations.

**3. 100% Offline & Fast:** Built with local LLMs (Ollama) and local compiled Tailwind CSS, it operates completely privately without subscription paywalls, API costs, or bandwidth throttling.


## 📽️ Demo

<img width="1364" height="632" alt="HerTutorAI-ezgif com-optimize (1)" src="https://github.com/user-attachments/assets/d7b74906-d128-4a73-b214-936858f48e40" />





---

## 🛠️ Back-End Tech Stack & Why We Chose It

| Technology | Role | Why This Over Alternatives? |
| :--- | :--- | :--- |
| **FastAPI** | Core API Framework | **Built for Async & Streaming:** Unlike synchronous frameworks like Flask, FastAPI is built natively on ASGI (Asynchronous Server Gateway Interface). This enables real-time token streaming from local LLMs without blocking incoming server requests. It also provides automatic interactive API documentation via Swagger (`/docs`). |
| **Ollama (Llama 3.2 & LLaVA)** | Local LLM Engine | **100% Offline & Private:** Runs high-performance open-source models completely locally on your hardware. Llama 3.2 handles academic explanations, while LLaVA provides vision capabilities to analyze study diagrams and image input. |
| **Pydantic** | Data Validation | **Type Safety:** Ensures strict runtime validation of requests and backend JSON responses, avoiding UI rendering crashes when passing structured flashcards and video matches to the frontend. |

---

## 📁 Project Structure

```text
LockIn-AI/
├── back-end/             # FastAPI server, local LLM prompts, & video search route
│   ├── app.py
│   └── videos.json
└── front-end/            # Vanilla JS/HTML frontend & Tailwind CLI config
    ├── index.html
    ├── script.js
    ├── input.css
    ├── style.css
    └── package.json
```
---

## 💻 Prerequisites 

Before running HerTutorAI, ensure you have the required software installed on your machine.

### Install Ollama & Local AI models 
Download and install Ollama from [ollama.com](https://ollama.com/download).
Open your terminal and pull the required open-source AI models:
  ```bash
  ollama pull llama3.2:1b
  ollama pull llava
```

## Installation
**1. Clone the Repository** 
  ```bash
  git clone (https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
  cd HerTutorAI
```
**2. Set Up & Start Back-End (FastAPI)**
Navigate to the backend directory
```bash
  cd back-end
```
Create and activate a Python virtual environment:
```bash
  python -m venv venv

  # On Windows (PowerShell):
  .\venv\Scripts\Activate

  # On Mac/Linux:
  source venv/bin/activate
```
Install Python dependencies
```bash
  pip install fastapi openai
```
start the FastAPI Backend server
```bash
uvicorn app:app --reload
```
**3. Set Up & Build Front-End (Tailwind CLI)**
Open a second terminal window and navigate to front-end/
  ```bash
  cd front-end
```
Open index.html in your browser (or use VS Code's Live Server extension)
