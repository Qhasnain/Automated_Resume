
const fs = require("fs");
const path = require("path");

const filesToUpdate = [
  "src/pages/ResumeWizard.tsx",
  "src/pages/ResumeEditor.tsx",
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, "utf8");
  
  // ResumeWizard specific replacements
  if (file.includes("ResumeWizard")) {
    content = content.replace(/bg-white/g, "bg-surface");
    content = content.replace(/bg-gray-50/g, "bg-background");
  }
  
  // ResumeEditor specific replacements
  if (file.includes("ResumeEditor")) {
    // Top bar, Sidebar, Forms
    content = content.replace(/bg-white border-b/g, "bg-surface border-b");
    content = content.replace(/bg-white border-r/g, "bg-surface border-r");
    content = content.replace(/bg-white p-6/g, "bg-surface p-6");
    content = content.replace(/bg-slate-200 p-8/g, "bg-background p-8");
    content = content.replace(/bg-white border border-border/g, "bg-surface border border-border");
    
    // Skeletons
    content = content.replace(/bg-slate-200/g, "bg-primary/10");
    content = content.replace(/bg-slate-100/g, "bg-primary/5");
    
    content = content.replace(/text-slate-800/g, "text-text-primary");
    content = content.replace(/hover:bg-white/g, "hover:bg-background");
    
    // The paper itself MUST remain white for print/PDF fidelity
    content = content.replace(/w-\[210mm\] h-\[297mm\] bg-surface/g, "w-[210mm] h-[297mm] bg-white"); 
  }

  fs.writeFileSync(filePath, content, "utf8");
});

console.log("Theme replacements complete.");

