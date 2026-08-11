import React from 'react';
import InlineEditable from '../InlineEditable';
import { formatSmartLink } from '../../lib/utils';

interface TemplateProps {
  resume: any;
  layout: any[];
  onUpdateField: (category: string, field: string, value: any, index?: number) => void;
}

export default function MinimalTemplate({ resume, layout, onUpdateField }: TemplateProps) {
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
          <div className="mb-5 print:break-inside-avoid" key="experience">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-800 mb-2">Experience</h2>
            <div className="space-y-4">
              {resume.experiences.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900">
                      <InlineEditable value={exp.company} onChange={(v) => onUpdateField('experiences', 'company', v, i)} placeholder="Company" />
                    </h3>
                    <span className="text-sm font-medium text-gray-500">
                      <InlineEditable value={exp.start_date} onChange={(v) => onUpdateField('experiences', 'start_date', v, i)} placeholder="Start Date" /> –{' '}
                      {exp.is_current ? 'Present' : <InlineEditable value={exp.end_date} onChange={(v) => onUpdateField('experiences', 'end_date', v, i)} placeholder="End Date" />}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 italic mb-1.5">
                    <InlineEditable value={exp.position} onChange={(v) => onUpdateField('experiences', 'position', v, i)} placeholder="Job Title" />
                    {exp.location && <span> | <InlineEditable value={exp.location} onChange={(v) => onUpdateField('experiences', 'location', v, i)} placeholder="Location" /></span>}
                  </div>
                  <InlineEditable multiline className="text-sm text-gray-600 block" value={exp.description} onChange={(v) => onUpdateField('experiences', 'description', v, i)} placeholder="Description of your responsibilities..." />
                </div>
              ))}
            </div>
          </div>
        );
      case 'education':
        if (!resume?.educations?.length) return null;
        return (
          <div className="mb-5 print:break-inside-avoid" key="education">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-800 mb-2">Education</h2>
            <div className="space-y-3">
              {resume.educations.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      <InlineEditable value={edu.institution} onChange={(v) => onUpdateField('educations', 'institution', v, i)} placeholder="Institution" />
                    </h3>
                    <div className="text-sm text-gray-700">
                      <InlineEditable value={edu.degree} onChange={(v) => onUpdateField('educations', 'degree', v, i)} placeholder="Degree" />
                      {' in '}
                      <InlineEditable value={edu.field_of_study} onChange={(v) => onUpdateField('educations', 'field_of_study', v, i)} placeholder="Field of Study" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 text-right">
                    <InlineEditable value={edu.start_date} onChange={(v) => onUpdateField('educations', 'start_date', v, i)} placeholder="Start Date" /> –{' '}
                    <InlineEditable value={edu.end_date} onChange={(v) => onUpdateField('educations', 'end_date', v, i)} placeholder="End Date" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!resume?.projects?.length) return null;
        return (
          <div className="mb-5 print:break-inside-avoid" key="projects">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-800 mb-2">Projects</h2>
            <div className="space-y-4">
              {resume.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex gap-2 items-center mb-0.5">
                    <h3 className="font-bold text-gray-900">
                      <InlineEditable value={proj.name} onChange={(v) => onUpdateField('projects', 'name', v, i)} placeholder="Project Name" />
                    </h3>
                    <div className="flex gap-2 text-xs text-gray-500">
                      {proj.github_link && <a href={proj.github_link} target="_blank" rel="noopener noreferrer" className="hover:text-black">GitHub</a>}
                      {proj.live_demo && <a href={proj.live_demo} target="_blank" rel="noopener noreferrer" className="hover:text-black">Live Demo</a>}
                    </div>
                  </div>
                  <InlineEditable multiline className="text-sm text-gray-600 block" value={proj.description} onChange={(v) => onUpdateField('projects', 'description', v, i)} placeholder="Project description..." />
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        if (Object.keys(skillsByCategory).length === 0) return null;
        return (
          <div className="mb-5 print:break-inside-avoid" key="skills">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-800 mb-2">Skills</h2>
            <div className="text-sm text-gray-700 flex flex-col gap-1">
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div key={cat} className="flex">
                  <span className="font-bold capitalize w-32 shrink-0">{cat.replace('_', ' ')}:</span>
                  <span className="flex-1">
                    {items.map((s, idx) => (
                      <span key={idx}>
                        <InlineEditable value={s.name} onChange={(v) => onUpdateField('skills', 'name', v, s.originalIndex)} placeholder="Skill" />
                        {idx < items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certificates':
        if (!resume?.certificates?.length) return null;
        return (
          <div className="mb-5 print:break-inside-avoid" key="certificates">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-800 mb-2">Certificates</h2>
            <div className="space-y-1">
              {resume.certificates.map((c: any, i: number) => (
                <div key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="font-bold text-gray-900">
                    <InlineEditable value={c.name} onChange={(v) => onUpdateField('certificates', 'name', v, i)} placeholder="Certificate Name" />
                  </span>
                  <span>by <InlineEditable value={c.issuer} onChange={(v) => onUpdateField('certificates', 'issuer', v, i)} placeholder="Issuer" /></span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
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
          <div className="mb-5 print:break-inside-avoid" key="languages">
            <h2 className="text-md font-bold uppercase tracking-wider text-gray-800 mb-2">Languages</h2>
            <div className="flex gap-4 text-sm text-gray-700">
              {resume.languages.map((l: any, i: number) => (
                <span key={i}>
                  <span className="font-bold text-gray-900">
                    <InlineEditable value={l.name} onChange={(v) => onUpdateField('languages', 'name', v, i)} placeholder="Language" />
                  </span>{' '}
                  (<InlineEditable value={l.proficiency} onChange={(v) => onUpdateField('languages', 'proficiency', v, i)} placeholder="Proficiency" />)
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
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 py-[25mm] px-[20mm] shadow-card-hover print:shadow-none print:w-full mx-auto" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black tracking-tight mb-2 flex items-center justify-center text-center">
            <InlineEditable value={pd.full_name} onChange={(v) => onUpdateField('personal_details', 'full_name', v)} placeholder="Your Name" />
          </h1>
          <p className="text-md text-gray-600 mb-3 uppercase tracking-widest font-medium text-center">
            <InlineEditable value={resume.target_job_title} onChange={(v) => onUpdateField('resume', 'target_job_title', v)} placeholder="Target Job Title" />
          </p>
          
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 font-light mt-4 justify-center">
            {pd.email && (
              <a href={formatSmartLink(pd.email, 'email')?.href} className="hover:text-black">
                <InlineEditable value={pd.email} onChange={(v) => onUpdateField('personal_details', 'email', v)} placeholder="Email" formatDisplay={(v) => formatSmartLink(v, 'email')?.label || v} />
              </a>
            )}
            {pd.phone && (
              <span>| <InlineEditable value={pd.phone} onChange={(v) => onUpdateField('personal_details', 'phone', v)} placeholder="Phone" formatDisplay={(v) => formatSmartLink(v, 'phone')?.label || v} /></span>
            )}
            {pd.location && <span>| <InlineEditable value={pd.location} onChange={(v) => onUpdateField('personal_details', 'location', v)} placeholder="Location" /></span>}
            {pd.linkedin && (
              <span>| <a href={formatSmartLink(pd.linkedin, 'linkedin')?.href} target="_blank" rel="noopener noreferrer" className="hover:text-black">
                <InlineEditable value={pd.linkedin} onChange={(v) => onUpdateField('personal_details', 'linkedin', v)} placeholder="LinkedIn" formatDisplay={(v) => formatSmartLink(v, 'linkedin')?.label || v} />
              </a></span>
            )}
          </div>
        </div>

      {/* Dynamic Sections */}
      {layout.filter(s => s.visible).map(section => renderSection(section.id))}
    </div>
  );
}
