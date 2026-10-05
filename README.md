# HerTutorAI 🎓

> **Built for a friend who asked for an easy way to organize learning resources, lecture breakdowns, and curated YouTube videos in one place.**

HerTutorAI is an offline-capable, multimodal academic study assistant created for **Hacktoberfest DEV Challenge 'Build for a Friend'**. It combines local LLM inference, pre-computed UI card rendering, and automated YouTube video curation into a fast, privacy-first learning hub.

---

## 📽️ Demo

![LockIn AI Demo](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/assets/demo.gif)

> *Tip: Replace the link above with a GIF or embed a YouTube link to your demo video here!*  
> **[Watch Full Video Demo on YouTube](https://youtube.com/your-demo-link)**

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
  git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
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
