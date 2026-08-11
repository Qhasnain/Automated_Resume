import React from 'react';
import InlineEditable from '../InlineEditable';
import { formatSmartLink } from '../../lib/utils';

interface TemplateProps {
  resume: any;
  layout: any[];
  onUpdateField: (category: string, field: string, value: any, index?: number) => void;
}

export default function ProfessionalTemplate({ resume, layout, onUpdateField }: TemplateProps) {
  const pd = resume?.personal_details || {};
  
  const skills = resume?.skills || [];
  const skillsByCategory: Record<string, any[]> = {};
  skills.forEach((s: any, idx: number) => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push({ ...s, originalIndex: idx });
  });

  const leftColumnSections = ['personal_details', 'skills', 'languages', 'certificates'];
  const rightColumnSections = ['experience', 'education', 'projects'];

  const renderSection = (id: string, isLeft: boolean) => {
    switch (id) {
      case 'experience':
        if (!resume?.experiences?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="experience">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 mb-3 pb-1">Professional Experience</h2>
            <div className="space-y-4">
              {resume.experiences.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 text-base">
                      <InlineEditable value={exp.position} onChange={(v) => onUpdateField('experiences', 'position', v, i)} placeholder="Job Title" />
                    </h3>
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <InlineEditable value={exp.start_date} onChange={(v) => onUpdateField('experiences', 'start_date', v, i)} placeholder="Start Date" /> –{' '}
                      {exp.is_current ? 'Present' : <InlineEditable value={exp.end_date} onChange={(v) => onUpdateField('experiences', 'end_date', v, i)} placeholder="End Date" />}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-700 mb-2 italic">
                    <InlineEditable value={exp.company} onChange={(v) => onUpdateField('experiences', 'company', v, i)} placeholder="Company" />{' | '}
                    <InlineEditable value={exp.location} onChange={(v) => onUpdateField('experiences', 'location', v, i)} placeholder="Location" />
                  </div>
                  <InlineEditable multiline className="text-sm text-slate-700 block leading-relaxed" value={exp.description} onChange={(v) => onUpdateField('experiences', 'description', v, i)} placeholder="Description of your responsibilities..." />
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!resume?.educations?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="education">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 mb-3 pb-1">Education</h2>
            <div className="space-y-4">
              {resume.educations.map((edu: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 text-base">
                      <InlineEditable value={edu.degree} onChange={(v) => onUpdateField('educations', 'degree', v, i)} placeholder="Degree" />
                      {' in '}
                      <InlineEditable value={edu.field_of_study} onChange={(v) => onUpdateField('educations', 'field_of_study', v, i)} placeholder="Field of Study" />
                    </h3>
                    <span className="text-sm font-medium text-slate-600">
                      <InlineEditable value={edu.start_date} onChange={(v) => onUpdateField('educations', 'start_date', v, i)} placeholder="Start Date" /> –{' '}
                      <InlineEditable value={edu.end_date} onChange={(v) => onUpdateField('educations', 'end_date', v, i)} placeholder="End Date" />
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    <InlineEditable value={edu.institution} onChange={(v) => onUpdateField('educations', 'institution', v, i)} placeholder="Institution" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!resume?.projects?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="projects">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-300 mb-3 pb-1">Projects</h2>
            <div className="space-y-4">
              {resume.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <h3 className="font-bold text-slate-800 text-base">
                    <InlineEditable value={proj.name} onChange={(v) => onUpdateField('projects', 'name', v, i)} placeholder="Project Name" />
                  </h3>
                  <InlineEditable multiline className="text-sm text-slate-700 block my-1" value={proj.description} onChange={(v) => onUpdateField('projects', 'description', v, i)} placeholder="Project description..." />
                  <div className="flex gap-4 mt-1 text-xs text-blue-700">
                    {proj.github_link && <a href={proj.github_link} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {proj.live_demo && <a href={proj.live_demo} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (Object.keys(skillsByCategory).length === 0) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="skills">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-300">Skills</h2>
            <div className="text-sm text-slate-700 space-y-3">
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <span className="font-bold block mb-1 text-slate-800 capitalize">{cat.replace('_', ' ')}</span>
                  <div className="flex flex-wrap gap-1">
                    {items.map((s, idx) => (
                      <span key={idx} className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">
                        <InlineEditable value={s.name} onChange={(v) => onUpdateField('skills', 'name', v, s.originalIndex)} placeholder="Skill" />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certificates':
        if (!resume?.certificates?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="certificates">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-300">Certificates</h2>
            <div className="space-y-3">
              {resume.certificates.map((c: any, i: number) => (
                <div key={i} className="text-sm">
                  <div className="font-bold text-slate-800">
                    <InlineEditable value={c.name} onChange={(v) => onUpdateField('certificates', 'name', v, i)} placeholder="Certificate Name" />
                  </div>
                  <div className="text-slate-600">
                    <InlineEditable value={c.issuer} onChange={(v) => onUpdateField('certificates', 'issuer', v, i)} placeholder="Issuer" />
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    <InlineEditable value={c.date} onChange={(v) => onUpdateField('certificates', 'date', v, i)} placeholder="Date" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!resume?.languages?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="languages">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-300">Languages</h2>
            <div className="space-y-2 text-sm">
              {resume.languages.map((l: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">
                    <InlineEditable value={l.name} onChange={(v) => onUpdateField('languages', 'name', v, i)} placeholder="Language" />
                  </span>
                  <span className="text-slate-500 text-xs">
                    <InlineEditable value={l.proficiency} onChange={(v) => onUpdateField('languages', 'proficiency', v, i)} placeholder="Proficiency" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-800 shadow-card-hover print:shadow-none print:w-full mx-auto flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Left Column */}
      <div className="w-[32%] bg-slate-50 py-[25mm] pl-[20mm] pr-6 border-r border-slate-200">
        <div className="mb-8">
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden border-2 border-slate-300 flex items-center justify-center">
             {pd.photo_url ? (
               <img src={pd.photo_url} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <span className="text-slate-400 text-4xl">{pd.full_name?.charAt(0) || 'JD'}</span>
             )}
          </div>
          
          <div className="space-y-3 mt-6 text-sm">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-300">Contact</h2>
            <div className="space-y-2">
              {pd.email && (
                <div className="break-all">
                  <a href={formatSmartLink(pd.email, 'email')?.href} className="text-blue-600 hover:underline">
                    <InlineEditable value={pd.email} onChange={(v) => onUpdateField('personal_details', 'email', v)} placeholder="Email" formatDisplay={(v) => formatSmartLink(v, 'email')?.label || v} />
                  </a>
                </div>
              )}
              {pd.phone && (
                <div>
                  <a href={formatSmartLink(pd.phone, 'phone')?.href} className="text-blue-600 hover:underline">
                    <InlineEditable value={pd.phone} onChange={(v) => onUpdateField('personal_details', 'phone', v)} placeholder="Phone" formatDisplay={(v) => formatSmartLink(v, 'phone')?.label || v} />
                  </a>
                </div>
              )}
              {pd.location && <div><InlineEditable value={pd.location} onChange={(v) => onUpdateField('personal_details', 'location', v)} placeholder="Location" /></div>}
              {pd.linkedin && (
                <div className="break-all">
                  <a href={formatSmartLink(pd.linkedin, 'linkedin')?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    <InlineEditable value={pd.linkedin} onChange={(v) => onUpdateField('personal_details', 'linkedin', v)} placeholder="LinkedIn URL" formatDisplay={(v) => formatSmartLink(v, 'linkedin')?.label || v} />
                  </a>
                </div>
              )}
              {pd.github && (
                <div className="break-all">
                  <a href={formatSmartLink(pd.github, 'github')?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    <InlineEditable value={pd.github} onChange={(v) => onUpdateField('personal_details', 'github', v)} placeholder="GitHub URL" formatDisplay={(v) => formatSmartLink(v, 'github')?.label || v} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {layout.filter(s => s.visible && leftColumnSections.includes(s.id)).map(section => renderSection(section.id, true))}
      </div>

      {/* Right Column */}
      <div className="w-[68%] py-[25mm] pr-[20mm] pl-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-slate-900 leading-tight">
            <InlineEditable value={pd.full_name} onChange={(v) => onUpdateField('personal_details', 'full_name', v)} placeholder="Your Name" />
          </h1>
          <p className="text-xl text-blue-600 mt-2 font-medium tracking-wide">
            <InlineEditable value={resume.target_job_title} onChange={(v) => onUpdateField('resume', 'target_job_title', v)} placeholder="Target Job Title" />
          </p>
        </div>

        {layout.filter(s => s.visible && rightColumnSections.includes(s.id)).map(section => renderSection(section.id, false))}
      </div>
    </div>
  );
}
