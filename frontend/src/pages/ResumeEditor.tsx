import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, Sparkles, FileText, Loader2, GripVertical, Eye, EyeOff, Plus, Minus, Maximize, LayoutTemplate } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { pdf } from '@react-pdf/renderer';
import api from '../lib/api';

import ModernTemplate from '../components/templates/ModernTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ResumePdf from '../components/pdf/ResumePdf';

const DEFAULT_LAYOUT = [
  { id: 'experience', name: 'Experience', visible: true },
  { id: 'education', name: 'Education', visible: true },
  { id: 'projects', name: 'Projects', visible: true },
  { id: 'skills', name: 'Skills', visible: true },
  { id: 'certificates', name: 'Certificates', visible: true },
  { id: 'languages', name: 'Languages', visible: true },
];

function SortableItem({ id, item, toggleVisibility }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg shadow-sm mb-2 group">
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="text-muted hover:text-text cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </button>
        <span className="font-medium text-text text-sm">{item.name}</span>
      </div>
      <button onClick={() => toggleVisibility(id)} className="text-muted hover:text-primary transition-colors">
        {item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
}

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'layout' | 'ats'>('layout');
  const [template, setTemplate] = useState('modern');
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [zoom, setZoom] = useState(1);
  const [editedData, setEditedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormMode, setIsFormMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [atsLoading, setAtsLoading] = useState(false);
  const [atsReport, setAtsReport] = useState<any>(null);
  const [jdText, setJdText] = useState('');
  const [jdResult, setJdResult] = useState<any>(null);
  const [jdLoading, setJdLoading] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const res = await api.get(`/resumes/${id}`);
      return res.data;
    }
  });

  useEffect(() => {
    if (resume && !editedData) {
      setEditedData(resume);
      if (resume.resume_style) {
        try {
          const styleData = JSON.parse(resume.resume_style);
          if (styleData.template) setTemplate(styleData.template);
          if (styleData.layout) setLayout(styleData.layout);
        } catch(e) {
          setTemplate(resume.resume_style);
        }
      }
    }
  }, [resume, editedData]);

  // Auto Save Logic
  useEffect(() => {
    if (!editedData || !resume) return;
    
    setHasUnsavedChanges(true);
    
    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        const styleStr = JSON.stringify({ template, layout });
        await api.put(`/resumes/${id}`, {
          title: editedData.title,
          target_job_title: editedData.target_job_title,
          resume_style: styleStr
        });
        
        // Save PD
        if (editedData.personal_details?.id) {
          await api.put(`/resumes/${id}/personal-details`, editedData.personal_details);
        }

        // Save Nested Arrays
        if (editedData.experiences) await api.put(`/resumes/${id}/experience`, editedData.experiences);
        if (editedData.educations) await api.put(`/resumes/${id}/education`, editedData.educations);
        if (editedData.skills) await api.put(`/resumes/${id}/skills`, editedData.skills);
        if (editedData.projects) await api.put(`/resumes/${id}/projects`, editedData.projects);
        if (editedData.certificates) await api.put(`/resumes/${id}/certificates`, editedData.certificates);
        if (editedData.languages) await api.put(`/resumes/${id}/languages`, editedData.languages);
        if (editedData.achievements) await api.put(`/resumes/${id}/achievements`, editedData.achievements);
        
      } catch(e) {
        console.error("Auto-save failed", e);
      } finally {
        setIsSaving(false);
        setHasUnsavedChanges(false);
        queryClient.invalidateQueries({ queryKey: ['resume', id] });
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [editedData, template, layout, id]);

  // Unsaved Changes Warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleUpdateField = useCallback((category: string, field: string, value: any, index?: number) => {
    setEditedData((prev: any) => {
      const next = { ...prev };
      if (index !== undefined) {
        if (!next[category]) next[category] = [];
        next[category][index] = { ...next[category][index], [field]: value };
      } else if (category === 'personal_details') {
        next.personal_details = { ...next.personal_details, [field]: value };
      } else {
        next[field] = value;
      }
      return next;
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleVisibility = (id: string) => {
    setLayout(items => items.map(item => item.id === id ? { ...item, visible: !item.visible } : item));
  };

  const handlePrint = async () => {
    try {
      setIsExporting(true);
      const blob = await pdf(<ResumePdf resume={editedData} layout={layout} template={template} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${editedData?.title || 'Resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !editedData) {
    return (
      <div className="h-screen bg-bg flex flex-col font-sans">
        {/* Skeleton Top Toolbar */}
        <div className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded animate-pulse"></div>
            <div className="w-48 h-6 bg-primary/10 rounded animate-pulse"></div>
          </div>
          <div className="w-32 h-8 bg-primary/10 rounded animate-pulse"></div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Skeleton Left Panel */}
          <div className="w-[350px] bg-surface border-r border-border p-6 flex flex-col gap-6">
            <div className="flex gap-2 border-b border-border pb-3">
              <div className="w-1/2 h-8 bg-primary/10 rounded animate-pulse"></div>
              <div className="w-1/2 h-8 bg-primary/10 rounded animate-pulse"></div>
            </div>
            <div className="h-32 bg-primary/5 rounded-lg animate-pulse w-full"></div>
            <div className="h-20 bg-primary/5 rounded-lg animate-pulse w-full"></div>
            <div className="h-20 bg-primary/5 rounded-lg animate-pulse w-full"></div>
          </div>
          
          {/* Skeleton Live Preview Area */}
          <div className="flex-1 bg-background p-8 flex justify-center items-start overflow-hidden">
            <div className="w-[210mm] h-[297mm] bg-white shadow-sm p-[25mm] flex flex-col gap-8">
               <div className="flex flex-col gap-3 border-b-2 border-slate-100 pb-6">
                 <div className="w-1/2 h-10 bg-primary/10 rounded animate-pulse"></div>
                 <div className="w-1/3 h-6 bg-primary/5 rounded animate-pulse"></div>
                 <div className="w-3/4 h-4 bg-primary/5 rounded animate-pulse mt-2"></div>
               </div>
               
               <div className="flex flex-col gap-4">
                 <div className="w-1/4 h-6 bg-primary/10 rounded animate-pulse mb-2"></div>
                 <div className="w-full h-24 bg-primary/5 rounded animate-pulse"></div>
                 <div className="w-full h-24 bg-primary/5 rounded animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let TemplateComponent = ModernTemplate;
  if (template === 'professional') TemplateComponent = ProfessionalTemplate;
  if (template === 'minimal') TemplateComponent = MinimalTemplate;

  return (
    <div className="h-screen bg-bg flex flex-col font-sans text-text">
      {/* Top Toolbar */}
      <div className="h-16 bg-surface border-b border-border glass-nav flex items-center justify-between px-6 shrink-0 print:hidden z-10 relative">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-muted hover:text-text transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-heading font-bold text-lg text-text">{editedData.title || 'Resume Editor'}</h1>
          {isSaving && <span className="text-xs text-muted flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving...</span>}
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-secondary-bg rounded-lg border border-border p-1">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-background rounded text-muted"><Minus size={16} /></button>
          <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-background rounded text-muted"><Plus size={16} /></button>
          <button onClick={() => setZoom(1)} className="p-1 hover:bg-background rounded text-muted ml-1 border-l border-border pl-2"><Maximize size={16} /></button>
        </div>

        <div className="flex items-center gap-3 z-10 relative">
          <button 
            onClick={() => setIsFormMode(!isFormMode)} 
            className="btn-secondary flex items-center gap-2 text-sm transition-all"
          >
            {isFormMode ? 'Live Preview' : 'Form Editor'}
          </button>
          <button onClick={handlePrint} disabled={isExporting} className="btn-primary flex items-center gap-2 text-sm">
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
            {isExporting ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-[350px] bg-surface border-r border-border overflow-y-auto print:hidden flex flex-col relative z-0">
          <div className="flex border-b border-border">
            <button 
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'layout' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'}`}
              onClick={() => setActiveTab('layout')}
            >
              Layout & Theme
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'ats' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'}`}
              onClick={() => setActiveTab('ats')}
            >
              ATS Matcher
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 bg-secondary-bg">
            {activeTab === 'layout' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2"><LayoutTemplate size={16}/> Template Selection</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setTemplate('modern')} 
                      className={`p-3 rounded-lg border-2 text-left transition-all ${template === 'modern' ? 'border-primary bg-primary-50' : 'border-border bg-white hover:border-primary/50'}`}
                    >
                      <div className="font-semibold text-sm">Modern</div>
                      <div className="text-xs text-muted">Clean & ATS-friendly</div>
                    </button>
                    <button 
                      onClick={() => setTemplate('professional')} 
                      className={`p-3 rounded-lg border-2 text-left transition-all ${template === 'professional' ? 'border-primary bg-primary-50' : 'border-border bg-white hover:border-primary/50'}`}
                    >
                      <div className="font-semibold text-sm">Professional</div>
                      <div className="text-xs text-muted">Two-column layout</div>
                    </button>
                    <button 
                      onClick={() => setTemplate('minimal')} 
                      className={`p-3 rounded-lg border-2 text-left transition-all ${template === 'minimal' ? 'border-primary bg-primary-50' : 'border-border bg-white hover:border-primary/50'}`}
                    >
                      <div className="font-semibold text-sm">Minimal</div>
                      <div className="text-xs text-muted">Simple & Elegant</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-text mb-3">Section Ordering</h3>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={layout.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      {layout.map((item) => (
                        <SortableItem key={item.id} id={item.id} item={item} toggleVisibility={toggleVisibility} />
                      ))}
                    </SortableContext>
                  </DndContext>
                  <p className="text-xs text-muted mt-2">Drag to reorder. Click eye to hide.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Job Description Matcher */}
                <div className="card p-4 space-y-3">
                  <h3 className="font-bold flex items-center gap-2 text-text"><FileText size={16} className="text-primary" /> JD Matcher</h3>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="input w-full text-sm"
                    rows={4}
                    placeholder="Paste job description here..."
                  />
                  <button onClick={async () => {
                    setJdLoading(true);
                    try {
                      const res = await api.post(`/ai/match-job/${id}`, { job_description: jdText });
                      setJdResult(res.data);
                    } catch(e) {}
                    setJdLoading(false);
                  }} disabled={jdLoading} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                    {jdLoading ? <Loader2 className="animate-spin" size={16} /> : 'Analyze Match'}
                  </button>
                  {jdResult && (
                    <div className="space-y-2 mt-3">
                      <div className="bg-bg border border-border rounded-lg p-3 text-center">
                        <p className="text-3xl font-bold text-primary">{jdResult.match_percentage}%</p>
                        <p className="text-xs text-muted">Match Score</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview / Form Mode */}
        <div className="flex-1 overflow-y-auto bg-background p-8 flex justify-center print:p-0 print:bg-white print:overflow-visible items-start relative">
          {isFormMode ? (
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-border p-8 animate-in fade-in zoom-in duration-300">
               <h2 className="text-2xl font-bold mb-6 text-text-primary">Classic Form Editor</h2>
               <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 mb-6">
                 <p className="font-medium">Form editing has been upgraded!</p>
                 <p className="text-sm mt-1">Please use the Live Preview mode to click and edit any field directly on the resume canvas. It's faster and updates in real-time.</p>
               </div>
               <button onClick={() => setIsFormMode(false)} className="btn-primary w-full">Switch to Live Preview</button>
            </div>
          ) : (
            <div 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }} 
              className="print:transform-none animate-in fade-in duration-300"
            >
              <TemplateComponent resume={editedData} layout={layout} onUpdateField={handleUpdateField} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
