import json
import re
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

class QueryRequest(BaseModel):
    prompt: str
    image_data: Optional[str] = None  

# FOR FLASHCARDS
class FlashcardRequest(BaseModel):
    prompt: str

def get_yt_thumbnail(url: str) -> str:
    match = re.search(r'(?:v=|\/v\/|embed\/|youtu\.be\/|\/shorts\/|si=)([^#\&\?\/]+)', url)
    if match:
        clean_id = url.split("youtu.be/")[1].split("?")[0] if "youtu.be/" in url else match.group(1)
        return f"https://img.youtube.com/vi/{clean_id}/maxresdefault.jpg"
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"

class QueryRequest(BaseModel):
    prompt: str = ""
    image_data: str | None = None

@app.post("/api/recommend")
async def recommend_video(request: QueryRequest):
    user_query = request.prompt.strip()
    has_image = bool(request.image_data and len(request.image_data.strip()) > 0)

    if not user_query and not has_image:
        return {
            "status": "error",
            "message": "Please provide a text prompt or upload an image."
        }

    try:
        with open("videos.json", "r") as file:
            watch_history = json.load(file)
    except FileNotFoundError:
        watch_history = []

    matched_video = None
    
    if user_query and not has_image:
        user_tokens = set(re.findall(r'\w+', user_query.lower()))
        filler_words = {
            "video", "videos", "give", "me", "show", "tutorial", "please", 
            "in", "for", "a", "the", "on", "and", "of", "with", "how", "to", 
            "can", "i", "what", "is", "explain", "about"
        }
        meaningful_user_tokens = user_tokens - filler_words

        best_match = None
        highest_score = 0

        for video in watch_history:
            title_tokens = set(re.findall(r'\w+', video.get('title', '').lower()))
            topics_str = " ".join(video.get('topics', []))
            topic_tokens = set(re.findall(r'\w+', topics_str.lower()))
            note_tokens = set(re.findall(r'\w+', video.get('my_note', '').lower()))

            title_score = len(meaningful_user_tokens & title_tokens) * 4
            topic_score = len(meaningful_user_tokens & topic_tokens) * 3
            note_score = len(meaningful_user_tokens & note_tokens) * 1
            
            total_score = title_score + topic_score + note_score

            if total_score > highest_score:
                highest_score = total_score
                best_match = video

        if highest_score >= 6:
            matched_video = best_match

    try:
        if has_image:
            raw_b64 = request.image_data
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",")[1]

            image_prompt = user_query if user_query else "Analyze this image/diagram in detail and explain its key components."

            explanation_resp = client.chat.completions.create(
                model="llava",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": image_prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{raw_b64}"}}
                        ]
                    }
                ],
                temperature=0.2
            )
            explanation_text = explanation_resp.choices[0].message.content

        else:
            system_explanation_prompt = (
                "You are an expert college academic tutor across computer science and engineering disciplines.\n"
                "CRITICAL FORMATTING INSTRUCTION:\n"
                "- Output ONLY plain text without any markdown syntax.\n"
                "- Do NOT use asterisks (** or *), hashes (###), backticks (` or ```), or bullet dashes.\n"
                "- Use standard line breaks and simple numbered lists (1., 2.) for readability."
                "Your task is to provide a direct, concise, and accurate answer to the user's prompt.\n"
                "Format rules:\n"
                "- Start directly with a clear 1-2 sentence core definition or overview.\n"
                "- Use clean bullet points or numbered steps for explanations.\n"
                "- Provide a practical example or standard CS diagram ASCII layout if helpful.\n"
                "- Stay strictly focused on the requested topic without introducing off-topic concepts."
            )

            explanation_resp = client.chat.completions.create(
                model="llama3.2:1b",
                messages=[
                    {"role": "system", "content": system_explanation_prompt},
                    {"role": "user", "content": user_query}
                ],
                temperature=0.2 
            )
            explanation_text = explanation_resp.choices[0].message.content

    except Exception as e:
        print(f"Ollama Model Error: {e}")
        explanation_text = (
            f"### 💡 Topic Overview: {user_query.capitalize() if user_query else 'Uploaded Diagram'}\n\n"
            f"Unable to process request via the local AI model. Verify that Ollama is running."
        )

    video_payload = None
    if matched_video and highest_score >= 6:
        video_payload = {
            "title": matched_video["title"],
            "url": matched_video["url"],
            "resource_url": matched_video.get("resource_url", matched_video["url"]),
            "my_note": matched_video.get("my_note", "No personal notes added."),
            "thumb": get_yt_thumbnail(matched_video["url"]),
            "topics": matched_video.get("topics", [])
        }

    return {
        "status": "success",
        "message": explanation_text,
        "video": video_payload
    }