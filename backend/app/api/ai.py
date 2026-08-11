import os
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.resume import Resume, ATSReport, JobMatch, CoverLetter
from app.schemas.resume import (
    AIAssistRequest, AIAssistResponse,
    GenerateSummaryRequest, GenerateSummaryResponse,
    OptimizeBulletsRequest, OptimizeBulletsResponse,
    ATSReportResponse, JobMatchRequest, JobMatchResponse,
    CoverLetterRequest, CoverLetterResponse,
    LinkedInRequest, LinkedInResponse,
)
from app.core.security import get_current_user

router = APIRouter(prefix="/api/ai", tags=["ai"])

OPENAI_KEY = os.getenv("OPENAI_API_KEY")

def _get_openai_client():
    if OPENAI_KEY:
        try:
            from openai import OpenAI
            return OpenAI(api_key=OPENAI_KEY)
        except ImportError:
            return None
    return None

def _get_resume_for_user(resume_id: str, user: User, db: Session) -> Resume:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.post("/generate-summary", response_model=GenerateSummaryResponse)
def generate_summary(data: GenerateSummaryRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_for_user(data.resume_id, user, db)
    
    # Gather resume data
    name = resume.personal_details.full_name if resume.personal_details else "Professional"
    job_title = resume.target_job_title or "Software Engineer"
    company = resume.target_company or "top tech companies"
    
    exp_list = [f"{e.position} at {e.company}" for e in resume.experiences if e.position]
    skills_list = [s.name for s in resume.skills if s.name]
    
    client = _get_openai_client()
    if client:
        prompt = f"""Write a professional resume summary for {name}, targeting a {job_title} role at {company}.
Experience: {', '.join(exp_list) if exp_list else 'Entry-level'}
Skills: {', '.join(skills_list) if skills_list else 'Various technical skills'}
Write 3-4 sentences. Be specific, quantitative, and impactful. Use action verbs."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200
            )
            return {"summary": response.choices[0].message.content.strip()}
        except Exception:
            pass
    
    # Template-based fallback
    years = len(exp_list) * 2 if exp_list else 1
    skill_text = ", ".join(skills_list[:5]) if skills_list else "modern technologies"
    summary = (
        f"Results-driven {job_title} with {years}+ years of experience building scalable applications. "
        f"Proficient in {skill_text}, with a proven track record of delivering high-impact solutions. "
        f"Passionate about writing clean, maintainable code and driving engineering excellence at {company}."
    )
    return {"summary": summary}

@router.post("/optimize-bullets", response_model=OptimizeBulletsResponse)
def optimize_bullets(data: OptimizeBulletsRequest, user: User = Depends(get_current_user)):
    client = _get_openai_client()
    if client:
        prompt = f"""Optimize these resume bullet points for a {data.job_title or 'Software Engineer'} role.
Make them impactful using the STAR method, add metrics where possible, use strong action verbs.
Bullets:
{chr(10).join(f'- {b}' for b in data.bullets)}
Return only the optimized bullets, one per line, starting with a dash."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500
            )
            text = response.choices[0].message.content.strip()
            optimized = [line.lstrip("- ").strip() for line in text.split("\n") if line.strip()]
            return {"optimized_bullets": optimized}
        except Exception:
            pass
    
    # Template-based fallback
    action_verbs = ["Spearheaded", "Engineered", "Architected", "Optimized", "Implemented", "Developed", "Led", "Streamlined"]
    metrics = ["reducing latency by 40%", "improving performance by 35%", "serving 1M+ users", "increasing efficiency by 50%"]
    optimized = []
    for i, bullet in enumerate(data.bullets):
        verb = action_verbs[i % len(action_verbs)]
        metric = metrics[i % len(metrics)]
        if bullet.strip():
            optimized.append(f"{verb} {bullet.strip().lower()}, {metric}")
        else:
            optimized.append(bullet)
    return {"optimized_bullets": optimized}

@router.post("/ats-score/{resume_id}", response_model=ATSReportResponse)
def calculate_ats_score(resume_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_for_user(resume_id, user, db)
    
    # Calculate scores based on resume completeness
    scores = {"keyword": 0, "formatting": 0, "readability": 0}
    
    # Keyword score - based on skills and experience
    skill_count = len(resume.skills)
    scores["keyword"] = min(100, skill_count * 10 + 20) if skill_count else 30
    
    # Formatting score - based on completeness
    sections_filled = sum([
        1 if resume.personal_details else 0,
        1 if resume.educations else 0,
        1 if resume.experiences else 0,
        1 if resume.projects else 0,
        1 if resume.skills else 0,
    ])
    scores["formatting"] = min(100, sections_filled * 20)
    
    # Readability - based on bullet points and descriptions
    bullet_count = sum(len(e.bullets or []) for e in resume.experiences)
    scores["readability"] = min(100, 50 + bullet_count * 5)
    
    overall = (scores["keyword"] + scores["formatting"] + scores["readability"]) // 3
    
    suggestions = []
    if scores["keyword"] < 70:
        suggestions.append("Add more relevant technical skills to improve keyword matching")
    if scores["formatting"] < 70:
        suggestions.append("Complete all resume sections for better ATS compatibility")
    if scores["readability"] < 70:
        suggestions.append("Add more bullet points to your experience descriptions")
    if not resume.personal_details or not resume.personal_details.linkedin:
        suggestions.append("Add your LinkedIn profile URL")
    
    report = ATSReport(
        resume_id=resume_id,
        overall_score=overall,
        keyword_score=scores["keyword"],
        formatting_score=scores["formatting"],
        readability_score=scores["readability"],
        suggestions=suggestions,
    )
    db.add(report)
    resume.ats_score = overall
    db.commit()
    db.refresh(report)
    return report

@router.post("/match-job/{resume_id}", response_model=JobMatchResponse)
def match_job(resume_id: str, data: JobMatchRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_for_user(resume_id, user, db)
    
    jd_lower = data.job_description.lower()
    user_skills = {s.name.lower() for s in resume.skills if s.name}
    
    # Extract keywords from JD
    common_skills = [
        "python", "javascript", "typescript", "react", "node.js", "aws", "docker",
        "kubernetes", "sql", "postgresql", "mongodb", "redis", "git", "ci/cd",
        "java", "c++", "go", "rust", "html", "css", "tailwind", "next.js",
        "fastapi", "django", "flask", "spring", "graphql", "rest", "api",
        "agile", "scrum", "machine learning", "deep learning", "tensorflow",
        "communication", "leadership", "problem-solving", "teamwork"
    ]
    
    jd_keywords = [s for s in common_skills if s in jd_lower]
    matched = [s for s in jd_keywords if s in user_skills]
    missing_skills = [s for s in jd_keywords if s not in user_skills]
    
    match_pct = int((len(matched) / max(len(jd_keywords), 1)) * 100)
    
    suggestions = []
    if missing_skills:
        suggestions.append(f"Consider adding these skills: {', '.join(missing_skills[:5])}")
    if match_pct < 50:
        suggestions.append("Your resume needs significant tailoring for this role")
    elif match_pct < 75:
        suggestions.append("Good foundation - add more targeted keywords to strengthen your application")
    else:
        suggestions.append("Strong match! Fine-tune your bullet points to highlight relevant experience")
    
    job_match = JobMatch(
        resume_id=resume_id,
        job_description=data.job_description,
        match_percentage=match_pct,
        missing_skills=missing_skills,
        missing_keywords=[k for k in jd_keywords if k not in user_skills],
        suggestions=suggestions,
    )
    db.add(job_match)
    db.commit()
    db.refresh(job_match)
    return job_match

@router.post("/cover-letter/{resume_id}", response_model=CoverLetterResponse)
def generate_cover_letter(resume_id: str, data: CoverLetterRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_for_user(resume_id, user, db)
    
    name = resume.personal_details.full_name if resume.personal_details else "Applicant"
    job_title = data.job_title or resume.target_job_title or "Software Engineer"
    company = data.company or resume.target_company or "your company"
    skills = ", ".join([s.name for s in resume.skills[:6] if s.name]) or "various technologies"
    exp_years = len(resume.experiences) * 2 if resume.experiences else 1
    
    client = _get_openai_client()
    if client:
        prompt = f"""Write a professional cover letter for {name} applying for {job_title} at {company}.
Skills: {skills}. Experience: {exp_years} years. Keep it under 300 words."""
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500
            )
            content = response.choices[0].message.content.strip()
        except Exception:
            content = None
    else:
        content = None
    
    if not content:
        content = f"""Dear Hiring Manager,

I am writing to express my strong interest in the {job_title} position at {company}. With {exp_years}+ years of experience in software development and expertise in {skills}, I am confident in my ability to make meaningful contributions to your team.

Throughout my career, I have consistently delivered high-quality solutions that drive business value. My experience spans full-stack development, system architecture, and collaborative team environments. I am passionate about writing clean, maintainable code and staying current with industry best practices.

I am particularly excited about {company}'s mission and the opportunity to work alongside talented engineers to solve complex challenges. My combination of technical expertise and strong communication skills makes me well-suited for this role.

I would welcome the opportunity to discuss how my background and skills align with your team's needs. Thank you for considering my application.

Best regards,
{name}"""
    
    cover_letter = CoverLetter(
        resume_id=resume_id,
        content=content,
        job_title=job_title,
        company=company,
    )
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)
    return cover_letter

@router.post("/linkedin/{resume_id}", response_model=LinkedInResponse)
def generate_linkedin(resume_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    resume = _get_resume_for_user(resume_id, user, db)
    
    name = resume.personal_details.full_name if resume.personal_details else "Professional"
    job_title = resume.target_job_title or "Software Engineer"
    skills = ", ".join([s.name for s in resume.skills[:5] if s.name]) or "modern technologies"
    
    headline = f"{job_title} | {skills.split(',')[0].strip()} Expert | Building Scalable Solutions"
    about = (
        f"I'm a passionate {job_title} with expertise in {skills}. "
        f"I love building products that make a difference and thrive in fast-paced, collaborative environments. "
        f"Currently open to new opportunities where I can leverage my skills to drive innovation and deliver impactful solutions. "
        f"Let's connect!"
    )
    
    return {"headline": headline, "about": about}


from app.services import gemini

@router.post("/assist", response_model=AIAssistResponse)
def ai_assist(data: AIAssistRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    action = data.action_type
    
    action_map = {
        "improve": gemini.improve_writing,
        "professional_rewrite": gemini.professional_rewrite,
        "humanize": gemini.humanize,
        "ats_optimize": gemini.ats_optimize,
        "expand": gemini.expand,
        "shorten": gemini.shorten,
        "grammar": gemini.fix_grammar,
        "spelling": gemini.fix_spelling,
        "rewrite": gemini.rewrite,
        "more_formal": gemini.more_formal,
        "more_friendly": gemini.more_friendly,
    }
    
    if action not in action_map:
        raise HTTPException(status_code=400, detail="Invalid AI action")
        
    func = action_map[action]
    result = func(data.text, data.job_description)
    return {"result": result}
