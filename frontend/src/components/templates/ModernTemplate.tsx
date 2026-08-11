import React from 'react';
import InlineEditable from '../InlineEditable';
import { formatSmartLink } from '../../lib/utils';

interface TemplateProps {
  resume: any;
  layout: any[];
  onUpdateField: (category: string, field: string, value: any, index?: number) => void;
}

export default function ModernTemplate({ resume, layout, onUpdateField }: TemplateProps) {
  const pd = resume?.personal_details || {};
  
  const skills = resume?.skills || [];
  const skillsByCategory: Record<string, any[]> = {};
  skills.forEach((s: any, idx: number) => {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push({ ...s, originalIndex: idx });
  });

  const renderSection = (id: string) => {
    switch (id) {
      case 'experience':
        if (!resume?.experiences?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="experience">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 mb-3 pb-1">Experience</h2>
            <div className="space-y-4">
              {resume.experiences.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">
                      <InlineEditable value={exp.position} onChange={(v) => onUpdateField('experiences', 'position', v, i)} placeholder="Job Title" />
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      <InlineEditable value={exp.start_date} onChange={(v) => onUpdateField('experiences', 'start_date', v, i)} placeholder="Start Date" /> –{' '}
                      {exp.is_current ? 'Present' : <InlineEditable value={exp.end_date} onChange={(v) => onUpdateField('experiences', 'end_date', v, i)} placeholder="End Date" />}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    <InlineEditable value={exp.company} onChange={(v) => onUpdateField('experiences', 'company', v, i)} placeholder="Company" />{' | '}
                    <InlineEditable value={exp.location} onChange={(v) => onUpdateField('experiences', 'location', v, i)} placeholder="Location" />
                  </div>
                  <InlineEditable multiline className="text-sm text-gray-700 block" value={exp.description} onChange={(v) => onUpdateField('experiences', 'description', v, i)} placeholder="Description of your responsibilities..." />
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!resume?.educations?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="education">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 mb-3 pb-1">Education</h2>
            <div className="space-y-4">
              {resume.educations.map((edu: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">
                      <InlineEditable value={edu.institution} onChange={(v) => onUpdateField('educations', 'institution', v, i)} placeholder="Institution" />
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      <InlineEditable value={edu.start_date} onChange={(v) => onUpdateField('educations', 'start_date', v, i)} placeholder="Start Date" /> –{' '}
                      <InlineEditable value={edu.end_date} onChange={(v) => onUpdateField('educations', 'end_date', v, i)} placeholder="End Date" />
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    <InlineEditable value={edu.degree} onChange={(v) => onUpdateField('educations', 'degree', v, i)} placeholder="Degree" />
                    {' in '}
                    <InlineEditable value={edu.field_of_study} onChange={(v) => onUpdateField('educations', 'field_of_study', v, i)} placeholder="Field of Study" />
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
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 mb-3 pb-1">Projects</h2>
            <div className="space-y-4">
              {resume.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <h3 className="font-bold text-gray-900">
                    <InlineEditable value={proj.name} onChange={(v) => onUpdateField('projects', 'name', v, i)} placeholder="Project Name" />
                  </h3>
                  <InlineEditable multiline className="text-sm text-gray-700 block my-1" value={proj.description} onChange={(v) => onUpdateField('projects', 'description', v, i)} placeholder="Project description..." />
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
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 mb-3 pb-1">Skills</h2>
            <div className="text-sm text-gray-800 space-y-1">
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <p key={cat}>
                  <span className="font-bold capitalize">{cat.replace('_', ' ')}:</span>{' '}
                  {items.map((s, idx) => (
                    <span key={idx}>
                      <InlineEditable value={s.name} onChange={(v) => onUpdateField('skills', 'name', v, s.originalIndex)} placeholder="Skill" />
                      {idx < items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        );
      case 'certificates':
        if (!resume?.certificates?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="certificates">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 mb-3 pb-1">Certificates</h2>
            <div className="space-y-2">
              {resume.certificates.map((c: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span className="font-medium text-sm text-gray-900">
                    <InlineEditable value={c.name} onChange={(v) => onUpdateField('certificates', 'name', v, i)} placeholder="Certificate Name" />
                    {' – '}
                    <InlineEditable value={c.issuer} onChange={(v) => onUpdateField('certificates', 'issuer', v, i)} placeholder="Issuer" />
                  </span>
                  <span className="text-sm text-gray-600">
                    <InlineEditable value={c.date} onChange={(v) => onUpdateField('certificates', 'date', v, i)} placeholder="Date" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'languages':
        if (!resume?.languages?.length) return null;
        return (
          <div className="mb-6 print:break-inside-avoid" key="languages">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 mb-3 pb-1">Languages</h2>
            <div className="flex gap-6 text-sm flex-wrap">
              {resume.languages.map((l: any, i: number) => (
                <span key={i}>
                  <span className="font-bold text-gray-900">
                    <InlineEditable value={l.name} onChange={(v) => onUpdateField('languages', 'name', v, i)} placeholder="Language" />
                  </span>{' – '}
                  <InlineEditable value={l.proficiency} onChange={(v) => onUpdateField('languages', 'proficiency', v, i)} placeholder="Proficiency" />
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black py-[25mm] px-[20mm] shadow-card-hover print:shadow-none print:w-full mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">
          <InlineEditable value={pd.full_name} onChange={(v) => onUpdateField('personal_details', 'full_name', v)} placeholder="Your Name" />
        </h1>
        <p className="text-sm text-gray-600 mt-1 font-medium">
          <InlineEditable value={resume.target_job_title} onChange={(v) => onUpdateField('resume', 'target_job_title', v)} placeholder="Target Job Title" />
        </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 print:text-xs mb-8">
            {pd.email && (
              <a href={formatSmartLink(pd.email, 'email')?.href} className="hover:text-blue-600">
                <InlineEditable value={pd.email} onChange={(v) => onUpdateField('personal_details', 'email', v)} placeholder="Email" formatDisplay={(v) => formatSmartLink(v, 'email')?.label || v} />
              </a>
            )}
            {pd.phone && (
              <a href={formatSmartLink(pd.phone, 'phone')?.href} className="hover:text-blue-600">
                <InlineEditable value={pd.phone} onChange={(v) => onUpdateField('personal_details', 'phone', v)} placeholder="Phone" formatDisplay={(v) => formatSmartLink(v, 'phone')?.label || v} />
              </a>
            )}
            {pd.location && <span>• <InlineEditable value={pd.location} onChange={(v) => onUpdateField('personal_details', 'location', v)} placeholder="Location" /></span>}
            
            {pd.linkedin && (
              <a href={formatSmartLink(pd.linkedin, 'linkedin')?.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <InlineEditable value={pd.linkedin} onChange={(v) => onUpdateField('personal_details', 'linkedin', v)} placeholder="LinkedIn URL" formatDisplay={(v) => formatSmartLink(v, 'linkedin')?.label || v} />
              </a>
            )}
            {pd.github && (
              <a href={formatSmartLink(pd.github, 'github')?.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                <InlineEditable value={pd.github} onChange={(v) => onUpdateField('personal_details', 'github', v)} placeholder="GitHub URL" formatDisplay={(v) => formatSmartLink(v, 'github')?.label || v} />
              </a>
            )}
          </div>
      </div>

      {/* Dynamic Sections */}
      {layout.filter(s => s.visible).map(section => renderSection(section.id))}
    </div>
  );
}
