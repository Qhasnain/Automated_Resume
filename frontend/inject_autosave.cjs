
const fs = require("fs");
const path = require("path");

const filePath = "c:/Users/hasna/OneDrive/Documents/resume/frontend/src/pages/ResumeWizard.tsx";
let content = fs.readFileSync(filePath, "utf8");

const autoSaveLogic = `
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
          title: resume?.title || \`\${data.personal?.full_name || "My"} Resume\`,
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
`;

content = content.replace("const eduArray = useFieldArray", autoSaveLogic + "\n\n  const eduArray = useFieldArray");

fs.writeFileSync(filePath, content, "utf8");
console.log("Auto-save injected.");

