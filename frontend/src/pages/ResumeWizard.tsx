import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAssistantButton from '../components/AIAssistantButton';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Loader2, X, Search } from 'lucide-react';
import api from '../lib/api';

const steps = [
  { id: 'personal', title: 'Personal Details' },
  { id: 'education', title: 'Education' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'skills', title: 'Skills' },
  { id: 'certificates', title: 'Certificates' },
  { id: 'achievements', title: 'Achievements' },
  { id: 'languages', title: 'Languages' },
  { id: 'target', title: 'Target Job' }
];

const inputClass = "w-full bg-surface border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted";
const labelClass = "block text-sm font-medium text-text-secondary mb-1.5";

// Generate year options from current year back to 1970
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

// LinkedIn-style skill suggestions across ALL fields
const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Technology': ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Machine Learning', 'Data Science', 'Artificial Intelligence', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Blockchain', 'iOS Development', 'Android Development'],
  'Marketing': ['Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Google Analytics', 'Facebook Ads', 'Brand Management', 'Market Research', 'Copywriting', 'Marketing Strategy', 'Influencer Marketing', 'Public Relations'],
  'Finance & Accounting': ['Financial Analysis', 'Accounting', 'Budgeting', 'Financial Modeling', 'Excel', 'QuickBooks', 'Tax Preparation', 'Auditing', 'Investment Banking', 'Risk Management', 'SAP', 'Tally', 'GST'],
  'Design': ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'UI/UX Design', 'Graphic Design', 'Video Editing', 'Adobe Premiere Pro', 'After Effects', 'Canva', 'InDesign', '3D Modeling', 'Animation', 'Photography'],
  'Sales & Business': ['Sales Strategy', 'CRM', 'Salesforce', 'Negotiation', 'Business Development', 'Lead Generation', 'Account Management', 'B2B Sales', 'Cold Calling', 'Pipeline Management', 'Revenue Growth', 'Client Relations'],
  'Healthcare': ['Patient Care', 'Medical Terminology', 'HIPAA', 'Clinical Research', 'Nursing', 'Pharmacy', 'Electronic Health Records', 'CPR', 'First Aid', 'Diagnostics', 'Healthcare Management'],
  'Education': ['Curriculum Development', 'Lesson Planning', 'Classroom Management', 'Student Assessment', 'E-Learning', 'Tutoring', 'Special Education', 'Educational Technology', 'Training & Development'],
  'Engineering': ['AutoCAD', 'SolidWorks', 'MATLAB', 'Project Management', 'Quality Assurance', 'Six Sigma', 'Lean Manufacturing', 'Mechanical Design', 'Electrical Engineering', 'Civil Engineering', 'Structural Analysis'],
  'Management': ['Project Management', 'Team Leadership', 'Strategic Planning', 'Agile', 'Scrum', 'Stakeholder Management', 'Change Management', 'Operations Management', 'Performance Management', 'Decision Making'],
  'Communication': ['Public Speaking', 'Technical Writing', 'Presentation Skills', 'Report Writing', 'Interpersonal Skills', 'Active Listening', 'Conflict Resolution', 'Cross-functional Collaboration'],
  'Legal': ['Legal Research', 'Contract Law', 'Compliance', 'Intellectual Property', 'Corporate Law', 'Litigation', 'Regulatory Affairs', 'Legal Writing', 'Due Diligence'],
  'Data & Analytics': ['Data Analysis', 'Tableau', 'Power BI', 'R', 'Statistics', 'Big Data', 'ETL', 'Data Visualization', 'Predictive Analytics', 'A/B Testing'],
  'Human Resources': ['Recruitment', 'Employee Relations', 'Performance Appraisal', 'Payroll', 'HRIS', 'Talent Acquisition', 'Onboarding', 'Workforce Planning', 'Compensation & Benefits'],
  'Soft Skills': ['Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity', 'Teamwork', 'Attention to Detail', 'Work Ethic', 'Emotional Intelligence', 'Multitasking'],
};

export default function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<{ category: string; name: string }[]>([]);
  const navigate = useNavigate();
  const [skillSearch, setSkillSearch] = useState('');
  const [activeSkillCategory, setActiveSkillCategory] = useState('Technology');
  const { id } = useParams();
  const isEditing = !!id;

  const { register, control, handleSubmit, watch, reset, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      personal: {},
      education: [],
      experience: [],
      projects: [],
      certificates: [],
      achievements: [],
      languages: [],
      target: {}
    }
  });

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/resumes/${id}`);
      return data;
    },
    enabled: isEditing
  });

  React.useEffect(() => {
    if (resume) {
      // Pre-populate skills
      if (resume.skills && resume.skills.length > 0) {
        setSelectedSkills(resume.skills.map((s: any) => ({
          category: s.category || 'Technology',
          name: s.name
        })));
      }

      // Pre-populate form
      reset({
        personal: resume.personal_details || {},
        education: resume.educations || [],
        experience: resume.experiences || [],
        projects: (resume.projects || []).map((p: any) => ({
          ...p,
          tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack
        })),
        certificates: resume.certificates || [],
        achievements: resume.achievements || [],
        languages: resume.languages || [],
        target: {
          target_job_title: resume.target_job_title,
          target_company: resume.target_company,
          experience_level: resume.experience_level,
          industry: resume.industry,
          resume_style: resume.styling ? JSON.parse(resume.styling).template : 'Professional'
        }
      });
    }
  }, [resume, reset]);

  // Unsaved changes warning
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  React.useEffect(() => {
    if (isDirty) {
      setHasUnsavedChanges(true);
    }
  }, [isDirty]);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);


  
  // Auto Save Logic
  const formValues = watch();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  React.useEffect(() => {
    if (!isEditing || !isDirty) return;
    
    const timeoutId = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        const data = formValues;
        
        const resumePayload = {
          title: resume?.title || `${data.personal?.full_name || "My"} Resume`,
          target_job_title: data.target?.target_job_title,
          target_company: data.target?.target_company,
          experience_level: data.target?.experience_level,
          industry: data.target?.industry,
          styling: resume?.styling || JSON.stringify({ template: (data.target?.resume_style || "Professional").toLowerCase() })
        };
        
        await api.put("/resumes/" + id, resumePayload);
        
        if (data.personal && Object.keys(data.personal).length > 0) await api.put("/resumes/" + id + "/personal", data.personal);
        
        setHasUnsavedChanges(false);
      } catch (e) {
        console.error("Auto save failed", e);
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [formValues, isEditing, isDirty, id, resume]);


  const eduArray = useFieldArray({ control, name: 'education' });
  const expArray = useFieldArray({ control, name: 'experience' });
  const projArray = useFieldArray({ control, name: 'projects' });
  const certArray = useFieldArray({ control, name: 'certificates' });
  const achArray = useFieldArray({ control, name: 'achievements' });
  const langArray = useFieldArray({ control, name: 'languages' });

  const addSkill = (category: string, name: string) => {
    if (!selectedSkills.find(s => s.name === name)) {
      setSelectedSkills([...selectedSkills, { category, name }]);
    }
  };

  const removeSkill = (name: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.name !== name));
  };

  const filteredSuggestions = skillSearch.trim()
    ? Object.entries(SKILL_SUGGESTIONS).flatMap(([cat, skills]) =>
        skills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.find(sel => sel.name === s))
          .map(s => ({ category: cat, name: s }))
      ).slice(0, 12)
    : (SKILL_SUGGESTIONS[activeSkillCategory] || [])
        .filter(s => !selectedSkills.find(sel => sel.name === s))
        .map(s => ({ category: activeSkillCategory, name: s }));

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let resumeId = id;

      const resumePayload = {
        title: resume?.title || `${data.personal.full_name || 'My'} Resume`,
        target_job_title: data.target?.target_job_title,
        target_company: data.target?.target_company,
        experience_level: data.target?.experience_level,
        industry: data.target?.industry,
        styling: resume?.styling || JSON.stringify({ template: (data.target?.resume_style || 'Professional').toLowerCase() })
      };

      if (isEditing) {
        await api.put(`/resumes/${resumeId}`, resumePayload);
      } else {
        const res = await api.post('/resumes', resumePayload);
        resumeId = res.data.id;
      }

      const skillEntries = selectedSkills.map(s => ({
        category: s.category,
        name: s.name,
        proficiency_level: 3
      }));

      const projects = (data.projects || []).map((p: any) => ({
        ...p,
        tech_stack: typeof p.tech_stack === 'string'
          ? p.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
          : p.tech_stack || [],
      }));

      await Promise.all([
        api.put(`/resumes/${resumeId}/personal`, data.personal || {}),
        data.education?.length > 0 && api.put(`/resumes/${resumeId}/education`, data.education),
        data.experience?.length > 0 && api.put(`/resumes/${resumeId}/experience`, data.experience),
        projects.length > 0 && api.put(`/resumes/${resumeId}/projects`, projects),
        skillEntries.length > 0 && api.put(`/resumes/${resumeId}/skills`, skillEntries),
        data.certificates?.length > 0 && api.put(`/resumes/${resumeId}/certificates`, data.certificates),
        data.achievements?.length > 0 && api.put(`/resumes/${resumeId}/achievements`, data.achievements),
        data.languages?.length > 0 && api.put(`/resumes/${resumeId}/languages`, data.languages),
      ].filter(Boolean));

      setHasUnsavedChanges(false);
      navigate(`/editor/${resumeId}`);
    } catch (error: any) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume: ' + (error.response?.data?.detail || error.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background-secondary flex text-text-primary font-sans">
      <div className="w-64 bg-surface border-r border-border p-6 flex flex-col shrink-0">
        <h2 className="text-xl font-heading font-bold mb-8 text-text-primary">Build Resume</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} onClick={() => setCurrentStep(index)} className={`flex items-center gap-3 cursor-pointer transition-colors ${index === currentStep ? 'text-primary' : index < currentStep ? 'text-text-primary' : 'text-text-secondary'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm ${index === currentStep ? 'border-primary bg-primary-50 text-primary' : index < currentStep ? 'border-green-500 bg-green-500 text-white' : 'border-border'}`}>
                {index < currentStep ? <Check size={16} /> : index + 1}
              </div>
              <span className="font-medium text-sm">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card bg-surface p-8 rounded-2xl border border-border shadow-card"
            >
              <h2 className="text-2xl font-heading font-bold mb-6 text-text-primary">{steps[currentStep].title}</h2>

              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input {...register('personal.full_name')} className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input {...register('personal.email')} className={inputClass} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input {...register('personal.phone')} className={inputClass} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input {...register('personal.location')} className={inputClass} placeholder="Mumbai, India" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>LinkedIn</label>
                      <input {...register('personal.linkedin')} className={inputClass} placeholder="linkedin.com/in/..." />
                    </div>
                    <div>
                      <label className={labelClass}>GitHub</label>
                      <input {...register('personal.github')} className={inputClass} placeholder="github.com/..." />
                    </div>
                    <div>
                      <label className={labelClass}>Portfolio</label>
                      <input {...register('personal.portfolio')} className={inputClass} placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  {eduArray.fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-border rounded-xl space-y-4 relative">
                      <button type="button" onClick={() => eduArray.remove(index)} className="absolute top-4 right-4 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Institution / University</label>
                          <input {...register(`education.${index}.institution`)} className={inputClass} placeholder="e.g. IIT Delhi" />
                        </div>
                        <div>
                          <label className={labelClass}>Degree</label>
                          <select {...register(`education.${index}.degree`)} className={inputClass}>
                            <option value="">Select Degree...</option>
                            <option value="10th">10th (SSC/CBSE/ICSE)</option>
                            <option value="12th">12th (HSC/CBSE/ICSE)</option>
                            <option value="Diploma">Diploma</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="B.E.">B.E.</option>
                            <option value="B.Sc">B.Sc</option>
                            <option value="B.Com">B.Com</option>
                            <option value="B.A.">B.A.</option>
                            <option value="BBA">BBA</option>
                            <option value="BCA">BCA</option>
                            <option value="MBBS">MBBS</option>
                            <option value="B.Pharm">B.Pharm</option>
                            <option value="LLB">LLB</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="M.Sc">M.Sc</option>
                            <option value="MBA">MBA</option>
                            <option value="MCA">MCA</option>
                            <option value="M.A.">M.A.</option>
                            <option value="M.Com">M.Com</option>
                            <option value="Ph.D.">Ph.D.</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Field of Study</label>
                          <input {...register(`education.${index}.field_of_study`)} className={inputClass} placeholder="e.g. Computer Science" />
                        </div>
                        <div>
                          <label className={labelClass}>CGPA / Marks / Percentage</label>
                          <input {...register(`education.${index}.gpa`)} className={inputClass} placeholder="e.g. 8.5 CGPA or 92%" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Start Year</label>
                          <select {...register(`education.${index}.start_date`)} className={inputClass}>
                            <option value="">Select Year...</option>
                            {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>End Year (or Expected)</label>
                          <select {...register(`education.${index}.end_date`)} className={inputClass}>
                            <option value="">Select Year...</option>
                            <option value="Present">Present (Ongoing)</option>
                            {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={labelClass + " !mb-0"}>Description (Optional)</label>
                          <AIAssistantButton 
                            value={watch(`education.${index}.description`) || ""} 
                            onUpdate={(val) => setValue(`education.${index}.description`, val, { shouldDirty: true })}
                            jobDescription={watch("target_job_title") || ""}
                          />
                        </div>
                        <textarea {...register(`education.${index}.description`)} className={inputClass} spellCheck="true" rows={2} placeholder="Relevant coursework, honors, activities..."  />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => eduArray.append({})} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Education</button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  {expArray.fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-border rounded-xl space-y-4 relative">
                      <button type="button" onClick={() => expArray.remove(index)} className="absolute top-4 right-4 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Company</label>
                          <input {...register(`experience.${index}.company`)} className={inputClass} placeholder="e.g. Google" />
                        </div>
                        <div>
                          <label className={labelClass}>Position / Role</label>
                          <input {...register(`experience.${index}.position`)} className={inputClass} placeholder="e.g. Software Engineer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}>Start Year</label>
                          <select {...register(`experience.${index}.start_date`)} className={inputClass}>
                            <option value="">Select...</option>
                            {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>End Year</label>
                          <select {...register(`experience.${index}.end_date`)} className={inputClass}>
                            <option value="">Select...</option>
                            <option value="Present">Present</option>
                            {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
                          </select>
                        </div>
                        <div className="flex items-center pt-8">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register(`experience.${index}.is_current`)} className="rounded border-border text-primary focus:ring-primary" />
                            <span className="text-sm">Current Role</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input {...register(`experience.${index}.location`)} className={inputClass} placeholder="e.g. Bangalore, India" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={labelClass + " !mb-0"}>Description</label>
                          <AIAssistantButton 
                            value={watch(`experience.${index}.description`) || ""} 
                            onUpdate={(val) => setValue(`experience.${index}.description`, val, { shouldDirty: true })}
                            jobDescription={watch("target_job_title") || ""}
                          />
                        </div>
                        <textarea {...register(`experience.${index}.description`)} className={inputClass} spellCheck="true" rows={3} placeholder="Describe your role, responsibilities, and key achievements..."  />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => expArray.append({})} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Experience</button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {projArray.fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-border rounded-xl space-y-4 relative">
                      <button type="button" onClick={() => projArray.remove(index)} className="absolute top-4 right-4 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                      <div>
                        <label className={labelClass}>Project Name</label>
                        <input {...register(`projects.${index}.name`)} className={inputClass} placeholder="e.g. E-Commerce Platform" />
                      </div>
                      <div>
                        <label className={labelClass}>Tech Stack (comma separated)</label>
                        <input {...register(`projects.${index}.tech_stack`)} className={inputClass} placeholder="e.g. React, Node.js, MongoDB" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>GitHub Link</label>
                          <input {...register(`projects.${index}.github_link`)} className={inputClass} placeholder="https://github.com/..." />
                        </div>
                        <div>
                          <label className={labelClass}>Live Demo</label>
                          <input {...register(`projects.${index}.live_demo`)} className={inputClass} placeholder="https://..." />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={labelClass + " !mb-0"}>Description</label>
                          <AIAssistantButton 
                            value={watch(`projects.${index}.description`) || ""} 
                            onUpdate={(val) => setValue(`projects.${index}.description`, val, { shouldDirty: true })}
                            jobDescription={watch("target_job_title") || ""}
                          />
                        </div>
                        <textarea {...register(`projects.${index}.description`)} className={inputClass} spellCheck="true" rows={3} placeholder="What does this project do? What problems does it solve?"  />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => projArray.append({})} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Project</button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5">
                  <p className="text-sm text-text-secondary">Select skills from any field — just like LinkedIn. Search or browse by category.</p>
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(s => (
                        <span key={s.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary border border-primary/30 rounded-full text-sm font-medium">
                          {s.name}
                          <button type="button" onClick={() => removeSkill(s.name)} className="hover:text-primary-700"><X size={14} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3.5 text-text-secondary" />
                    <input
                      value={skillSearch}
                      onChange={e => setSkillSearch(e.target.value)}
                      className={`${inputClass} pl-10`}
                      placeholder="Search skills... e.g. Python, Marketing, Excel"
                    />
                  </div>
                  {!skillSearch && (
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(SKILL_SUGGESTIONS).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveSkillCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSkillCategory === cat ? 'bg-primary text-white' : 'bg-background-secondary text-text-secondary hover:bg-border hover:text-text-primary'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {filteredSuggestions.map(s => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => addSkill(s.category, s.name)}
                        className="px-3 py-1.5 bg-background-secondary hover:bg-border border border-transparent rounded-full text-sm text-text-secondary hover:text-text-primary transition-all"
                      >
                        + {s.name}
                      </button>
                    ))}
                    {filteredSuggestions.length === 0 && skillSearch && (
                      <button
                        type="button"
                        onClick={() => { addSkill('Custom', skillSearch.trim()); setSkillSearch(''); }}
                        className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 border border-primary/30 rounded-full text-sm text-primary transition-all"
                      >
                        + Add "{skillSearch.trim()}" as custom skill
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected</p>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  {certArray.fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-border rounded-xl space-y-4 relative">
                      <button type="button" onClick={() => certArray.remove(index)} className="absolute top-4 right-4 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Name</label><input {...register(`certificates.${index}.name`)} className={inputClass} placeholder="e.g. AWS Certified Developer" /></div>
                        <div><label className={labelClass}>Issuer</label><input {...register(`certificates.${index}.issuer`)} className={inputClass} placeholder="e.g. Amazon Web Services" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Date</label><input {...register(`certificates.${index}.date`)} className={inputClass} placeholder="e.g. Jan 2024" /></div>
                        <div><label className={labelClass}>Certificate URL</label><input {...register(`certificates.${index}.url`)} className={inputClass} placeholder="https://..." /></div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => certArray.append({})} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Certificate</button>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  {achArray.fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-border rounded-xl space-y-4 relative">
                      <button type="button" onClick={() => achArray.remove(index)} className="absolute top-4 right-4 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Title</label><input {...register(`achievements.${index}.title`)} className={inputClass} placeholder="e.g. Won Hackathon" /></div>
                        <div><label className={labelClass}>Date</label><input {...register(`achievements.${index}.date`)} className={inputClass} placeholder="e.g. Mar 2024" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className={labelClass + " !mb-0"}>Description</label>
                          <AIAssistantButton 
                            value={watch(`achievements.${index}.description`) || ""} 
                            onUpdate={(val) => setValue(`achievements.${index}.description`, val, { shouldDirty: true })}
                            jobDescription={watch("target_job_title") || ""}
                          />
                        </div>
                        <textarea {...register(`achievements.${index}.description`)} className={inputClass} spellCheck="true" rows={2} placeholder="Describe the achievement..."  />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => achArray.append({})} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Achievement</button>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-6">
                  {langArray.fields.map((field, index) => (
                    <div key={field.id} className="p-5 border border-border rounded-xl space-y-4 relative">
                      <button type="button" onClick={() => langArray.remove(index)} className="absolute top-4 right-4 text-text-secondary hover:text-danger"><Trash2 size={18} /></button>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Language</label><input {...register(`languages.${index}.name`)} className={inputClass} placeholder="e.g. English" /></div>
                        <div>
                          <label className={labelClass}>Proficiency</label>
                          <select {...register(`languages.${index}.proficiency`)} className={inputClass}>
                            <option value="">Select...</option>
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => langArray.append({})} className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={18} /> Add Language</button>
                </div>
              )}

              {currentStep === 8 && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Target Job Title</label>
                    <input {...register('target.target_job_title')} className={inputClass} placeholder="e.g. Senior Frontend Engineer" />
                  </div>
                  <div>
                    <label className={labelClass}>Target Company (Optional)</label>
                    <input {...register('target.target_company')} className={inputClass} placeholder="e.g. Google" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Experience Level</label>
                      <select {...register('target.experience_level')} className={inputClass}>
                        <option value="Entry">Entry Level / Fresher</option>
                        <option value="Mid">Mid Level (2-5 yrs)</option>
                        <option value="Senior">Senior (5+ yrs)</option>
                        <option value="Lead">Lead / Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Industry</label>
                      <input {...register('target.industry')} className={inputClass} placeholder="e.g. Technology, Healthcare" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Resume Style</label>
                    <select {...register('target.resume_style')} className={inputClass}>
                      <option value="Professional">Professional</option>
                      <option value="Creative">Creative</option>
                      <option value="Academic">Academic</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-border bg-surface flex justify-between items-center z-10">
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button onClick={prevStep} className="btn-secondary flex items-center gap-2">
                <ChevronLeft size={18} /> Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button onClick={nextStep} className="btn-primary flex items-center gap-2 ml-auto">
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmit(onSubmit, (errs) => alert("Validation errors: " + JSON.stringify(errs)))} disabled={isSubmitting} className="btn-primary flex items-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {isEditing ? 'Save Changes' : 'Create Resume'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
