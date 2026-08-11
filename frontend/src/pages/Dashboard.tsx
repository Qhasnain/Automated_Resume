import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Settings, LogOut, LayoutDashboard, Star, Clock, Crown, Copy, Moon, Sun, Monitor, Menu, X, MoreHorizontal, Edit, Eye, Download, Trash2, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

type TabType = 'dashboard' | 'resumes' | 'templates' | 'settings';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => { if(confirm('Are you sure you want to delete this resume?')) { await api.delete('/resumes/' + id); refetchResumes(); } };
  const handleDuplicate = async (id: string) => { const res = await api.get('/resumes/' + id); const { id: _, created_at, updated_at, ...data } = res.data; data.title = data.title + ' (Copy)'; await api.post('/resumes', data); refetchResumes(); };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    }
  });

  const { data: recentResumes, isLoading: resumesLoading, refetch: refetchResumes } = useQuery({
    queryKey: ['recentResumes'],
    queryFn: async () => {
      const res = await api.get('/dashboard/recent');
      return res.data;
    }
  });

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderDashboardTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-1">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-text-secondary">Here's what's happening with your job search.</p>
        </div>
        <button onClick={() => navigate('/wizard')} className="btn-primary shadow-lg font-medium">
          <Plus size={20} />
          New Resume
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">Total Resumes</p>
              <p className="text-3xl font-mono font-bold text-text-primary">{statsLoading ? '-' : stats?.total_resumes || 0}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">Avg ATS Score</p>
              <p className="text-3xl font-mono font-bold text-text-primary">{statsLoading ? '-' : stats?.avg_ats_score || 0}%</p>
            </div>
          </div>
          {!statsLoading && stats?.avg_ats_score > 70 && (
            <span className="badge bg-success/20 text-success">Excellent</span>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Crown size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm font-medium mb-1">Account Tier</p>
              <p className="text-xl font-bold text-text-primary capitalize">{stats?.user_tier || 'Pro Plan'}</p>
            </div>
          </div>
          <span className="badge bg-purple-500/20 text-purple-600">Active</span>
        </motion.div>
      </div>

      {/* Recent Resumes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-serif text-text-primary">Recent Resumes</h2>
          <button onClick={() => setActiveTab('resumes')} className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        
        {resumesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-40"></div>
            ))}
          </div>
        ) : recentResumes?.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">No resumes yet</h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">Create your first AI-powered resume and start applying to jobs faster.</p>
            <button onClick={() => navigate('/wizard')} className="btn-primary">
              <Plus size={20} /> Start Building
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
            {recentResumes?.slice(0, 3).map((resume: any, index: number) => {
              const score = resume.ats_score || 0;
              const badgeClass = score > 70 ? 'bg-success/20 text-success' : score > 50 ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger';

              return (
                
              <div key={resume.id} className="card p-6 relative group h-[210px] flex flex-col justify-between">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative dropdown-container">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === resume.id ? null : resume.id); }} className="p-2 hover:bg-background rounded-lg text-text-secondary">
                      <MoreHorizontal size={20} />
                    </button>
                    {openMenuId === resume.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); navigate('/editor/' + resume.id); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Eye size={16}/> Open Preview</button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); navigate('/wizard/' + resume.id); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Edit size={16}/> Edit Details</button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDuplicate(resume.id); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Copy size={16}/> Duplicate</button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); window.open('/editor/' + resume.id + '?export=true', '_blank'); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Download size={16}/> Download PDF</button>
                        <div className="h-px bg-border my-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDelete(resume.id); }} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 flex items-center gap-2"><Trash2 size={16}/> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start mb-6 cursor-pointer" onClick={() => navigate('/editor/' + resume.id)}>
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className={"badge " + badgeClass}>{score > 0 ? score + "% ATS" : "No Score"}</span>
                </div>
                <div onClick={() => navigate('/editor/' + resume.id)} className="cursor-pointer">
                  <h3 className="font-bold text-text-primary mb-1 truncate">{resume.title || "Untitled Resume"}</h3>
                  <p className="text-sm text-text-secondary mb-4 truncate">{resume.target_job_title || "No target job title"}</p>
                  <div className="flex items-center text-sm text-text-secondary gap-4">
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(resume.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderResumesTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-1">My Resumes</h1>
          <p className="text-text-secondary">Manage and edit your saved resumes.</p>
        </div>
        <button onClick={() => navigate('/wizard')} className="btn-primary shadow-lg font-medium">
          <Plus size={20} />
          New Resume
        </button>
      </div>

      {resumesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton h-40"></div>
          ))}
        </div>
      ) : recentResumes?.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-xl font-bold mb-2 text-text-primary">No resumes found</h3>
          <p className="text-text-secondary mb-6">You haven't created any resumes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
          {recentResumes?.map((resume: any, index: number) => {
            const score = resume.ats_score || 0;
            const badgeClass = score > 70 ? 'bg-success/20 text-success' : score > 50 ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger';

            return (
              
              <div key={resume.id} className="card p-6 relative group h-[210px] flex flex-col justify-between">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="relative dropdown-container">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === resume.id ? null : resume.id); }} className="p-2 hover:bg-background rounded-lg text-text-secondary">
                      <MoreHorizontal size={20} />
                    </button>
                    {openMenuId === resume.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); navigate('/editor/' + resume.id); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Eye size={16}/> Open Preview</button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); navigate('/wizard/' + resume.id); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Edit size={16}/> Edit Details</button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDuplicate(resume.id); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Copy size={16}/> Duplicate</button>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); window.open('/editor/' + resume.id + '?export=true', '_blank'); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/10 flex items-center gap-2"><Download size={16}/> Download PDF</button>
                        <div className="h-px bg-border my-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleDelete(resume.id); }} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 flex items-center gap-2"><Trash2 size={16}/> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start mb-6 cursor-pointer" onClick={() => navigate('/editor/' + resume.id)}>
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className={"badge " + badgeClass}>{score > 0 ? score + "% ATS" : "No Score"}</span>
                </div>
                <div onClick={() => navigate('/editor/' + resume.id)} className="cursor-pointer">
                  <h3 className="font-bold text-text-primary mb-1 truncate">{resume.title || "Untitled Resume"}</h3>
                  <p className="text-sm text-text-secondary mb-4 truncate">{resume.target_job_title || "No target job title"}</p>
                  <div className="flex items-center text-sm text-text-secondary gap-4">
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(resume.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  );

  const renderTemplatesTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-1">Templates Gallery</h1>
        <p className="text-text-secondary">Choose a template for your next resume.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: 'modern', name: 'Modern', desc: 'Clean and contemporary design.' },
          { id: 'professional', name: 'Professional', desc: 'Traditional and ATS-friendly.' },
          { id: 'minimal', name: 'Minimal', desc: 'Simple, elegant, and focus on content.' }
        ].map((tpl) => (
          <div key={tpl.id} className="card p-6 flex flex-col items-center text-center">
            <div className="w-full h-48 bg-background border border-border rounded-xl mb-4 flex items-center justify-center">
              <span className="text-text-muted font-serif italic">Preview</span>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">{tpl.name}</h3>
            <p className="text-sm text-text-secondary mb-4">{tpl.desc}</p>
            <button className="btn-secondary w-full" onClick={() => navigate('/wizard')}>Use Template</button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSettingsTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-text-secondary">Manage your account and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
              <input type="text" className="input" value={user?.full_name || ''} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
              <input type="email" className="input" value={user?.email || ''} readOnly />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Appearance</h2>
          <p className="text-sm text-text-secondary mb-4">Choose your preferred theme.</p>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-primary/50'}`}
            >
              <Sun size={24} />
              <span className="font-medium text-sm">Light</span>
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-primary/50'}`}
            >
              <Moon size={24} />
              <span className="font-medium text-sm">Dark</span>
            </button>
            <button 
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-primary/50'}`}
            >
              <Monitor size={24} />
              <span className="font-medium text-sm">System</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex font-sans transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-border z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-serif font-bold text-sm text-white">R</span>
          </div>
          <span className="font-serif font-bold text-lg text-text-primary">ResumeForge<span className="text-primary">AI</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-secondary hover:text-primary">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-64 fixed inset-y-0 left-0 bg-sidebar border-r border-border flex flex-col z-10 transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} pt-16 md:pt-0`}>
        <div className="p-6">
          <div className="hidden md:flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-serif font-bold text-xl text-white">R</span>
            </div>
            <span className="font-serif font-bold text-xl text-text-primary">ResumeForge<span className="text-primary">AI</span></span>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-primary/5 hover:text-primary'}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('resumes'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'resumes' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-primary/5 hover:text-primary'}`}
            >
              <FileText size={20} />
              <span>My Resumes</span>
            </button>
            <button 
              onClick={() => { setActiveTab('templates'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'templates' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-primary/5 hover:text-primary'}`}
            >
              <Copy size={20} />
              <span>Templates</span>
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-primary/5 hover:text-primary'}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-mono shrink-0">
              {getInitials(user?.full_name)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-text-primary truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-0" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <div className="md:ml-64 flex-1 overflow-y-auto min-h-screen pt-16 md:pt-0">
        <div className="p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'resumes' && renderResumesTab()}
            {activeTab === 'templates' && renderTemplatesTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
