
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, Check, X, Undo2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";

interface AIAssistantButtonProps {
  value: string;
  onUpdate: (newValue: string) => void;
  jobDescription?: string;
  className?: string;
}

const AI_ACTIONS = [
  { id: "improve", label: "Improve Writing", category: "General" },
  { id: "professional_rewrite", label: "Professional Rewrite", category: "Style" },
  { id: "humanize", label: "Humanize", category: "Style" },
  { id: "ats_optimize", label: "ATS Optimize", category: "Targeting" },
  { id: "expand", label: "Expand", category: "Length" },
  { id: "shorten", label: "Shorten", category: "Length" },
  { id: "grammar", label: "Fix Grammar", category: "Corrections" },
  { id: "spelling", label: "Fix Spelling", category: "Corrections" },
  { id: "rewrite", label: "Rewrite", category: "General" },
  { id: "more_formal", label: "More Formal", category: "Style" },
  { id: "more_friendly", label: "More Friendly", category: "Style" },
];

export default function AIAssistantButton({ value, onUpdate, jobDescription, className = "" }: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [originalValue, setOriginalValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [lastAction, setLastAction] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (actionId: string) => {
    if (!value || value.trim() === "") return;
    setIsOpen(false);
    setIsLoading(true);
    setLastAction(actionId);
    
    try {
      const res = await api.post("/ai/assist", {
        text: value,
        action_type: actionId,
        job_description: jobDescription
      });
      setOriginalValue(value);
      setNewValue(res.data.result);
      setShowDiff(true);
    } catch (err) {
      console.error("AI Assistant Error:", err);
      // Optional: Add toast notification for error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onUpdate(newValue);
    setShowDiff(false);
  };

  const handleIgnore = () => {
    setShowDiff(false);
  };

  const handleRegenerate = () => {
    setShowDiff(false);
    handleAction(lastAction);
  };

  return (
    <div className={"relative inline-block " + className} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || !value || value.trim() === ""}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        AI Assistant
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 left-0 mt-2 w-56 max-h-80 overflow-y-auto bg-surface border border-border rounded-xl shadow-xl p-1"
          >
            {AI_ACTIONS.map((action, idx) => {
               const showCategory = idx === 0 || AI_ACTIONS[idx - 1].category !== action.category;
               return (
                 <React.Fragment key={action.id}>
                   {showCategory && <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-text-muted tracking-wider">{action.category}</div>}
                   <button
                     type="button"
                     onClick={() => handleAction(action.id)}
                     className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                   >
                     {action.label}
                   </button>
                 </React.Fragment>
               );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDiff && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-secondary/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Sparkles size={18} /> AI Suggestion
                </div>
                <button onClick={handleIgnore} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Original</h4>
                  <div className="p-3 bg-danger/5 border border-danger/10 text-text-secondary rounded-lg text-sm line-through decoration-danger/30">
                    {originalValue}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">New</h4>
                  <div className="p-3 bg-success/5 border border-success/10 text-text-primary rounded-lg text-sm">
                    {newValue}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-background/50 flex flex-wrap gap-3 justify-end">
                <button onClick={handleIgnore} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
                  <Undo2 size={16} /> Ignore
                </button>
                <button onClick={handleRegenerate} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2">
                  <RotateCcw size={16} /> Generate Again
                </button>
                <button onClick={handleAccept} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                  <Check size={16} /> Accept Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

