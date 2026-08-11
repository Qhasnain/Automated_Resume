import os
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    # Use gemini-2.5-flash for fast text tasks
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

def get_gemini_response(prompt: str) -> str:
    if not model:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing from environment variables.")
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

def build_system_prompt() -> str:
    return """You are an expert resume writer and career coach. Your goal is to improve resume content.
CRITICAL RULES:
1. NEVER use robotic, cliché, or overly flowery language.
2. AVOID phrases like: "As a highly motivated professional", "Results-driven", "I leveraged", "I utilized", "Proven track record".
3. Write naturally, professionally, and make it recruiter/ATS friendly.
4. Keep the output concise and directly answer the prompt without conversational filler (do NOT say "Here is the improved text:").
5. Return ONLY the final improved text.
"""

def improve_writing(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nImprove the following resume text to be more professional, clear, and impactful."
    if job_description:
        prompt += f" Tailor it slightly to align with this job description if relevant, but do not keyword stuff: {job_description}"
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def professional_rewrite(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nCompletely rewrite the following text to sound extremely professional, executive-level, and polished, while remaining human and natural."
    if job_description:
        prompt += f" Align with this job description: {job_description}"
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def humanize(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nRewrite this text to sound MORE HUMAN, natural, and authentic. Remove any robotic corporate jargon or 'AI-sounding' words, while keeping it appropriate for a resume."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def ats_optimize(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nOptimize this resume text for ATS (Applicant Tracking Systems). Use strong action verbs and ensure industry-standard terminology is used naturally."
    if job_description:
        prompt += f" Naturally integrate relevant keywords from this job description: {job_description}"
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def expand(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nExpand upon the following brief resume bullet point or description. Add reasonable, professional context to make it a fully fleshed out, impressive achievement or responsibility. Use the STAR method if applicable."
    if job_description:
        prompt += f" Use this job description for context on what skills to emphasize: {job_description}"
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def shorten(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nShorten the following resume text. Make it punchy, concise, and remove all unnecessary fluff. Keep only the most impactful details."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def fix_grammar(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nFix all grammar, punctuation, and capitalization errors in the following text. Do not rewrite the sentence structure unnecessarily, just fix the errors."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def fix_spelling(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nFix all spelling errors in the following text. Do not change the wording, just fix the spelling."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def rewrite(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nProvide a strong alternative rewrite for the following resume text."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def more_formal(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nRewrite the following text to be more formal and traditional, suitable for a conservative industry (e.g., law, finance)."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)

def more_friendly(text: str, job_description: str = None) -> str:
    prompt = build_system_prompt() + f"\n\nRewrite the following text to be a bit more friendly, conversational, and energetic, suitable for modern tech, startups, or creative roles. Do not make it unprofessional."
    prompt += f"\n\nOriginal Text:\n{text}"
    return get_gemini_response(prompt)
