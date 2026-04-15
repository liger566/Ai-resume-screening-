import { useState } from "react";
import { motion } from "motion/react";
import { ResumeUpload } from "../components/ResumeUpload";
import { analyzeResume } from "../lib/gemini";
import { AnalysisResult, JobRole, JOB_ROLES_JD } from "../types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { Loader2, Sparkles, FileText, Target, CheckCircle2 } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Analyzer() {
  const [selectedRole, setSelectedRole] = useState<JobRole | "">("");
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleTextExtracted = (text: string, name: string) => {
    setResumeText(text);
    setFileName(name);
  };

  const startAnalysis = async () => {
    if (!resumeText || !selectedRole) {
      toast.error("Please select a role and upload your resume first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText, selectedRole as JobRole);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, "analyses"), {
        userId: auth.currentUser?.uid,
        fileName,
        role: selectedRole,
        ...result,
        createdAt: serverTimestamp()
      });
      
      toast.success("Analysis complete!");
      navigate(`/reports/${docRef.id}`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Resume Analyzer</h1>
        <p className="text-slate-500 text-lg">Optimize your resume for your target job role with AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Configuration */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                1. Target Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={(v) => setSelectedRole(v as JobRole)} value={selectedRole}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(JOB_ROLES_JD).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRole && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">Focus Areas:</p>
                  {JOB_ROLES_JD[selectedRole as JobRole]}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                2. Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 font-bold gap-2"
                disabled={!resumeText || !selectedRole || isAnalyzing}
                onClick={startAnalysis}
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Analyze Now</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Upload */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200 min-h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                3. Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your resume in PDF, DOCX, or TXT format.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              {!resumeText ? (
                <ResumeUpload onTextExtracted={handleTextExtracted} />
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{fileName}</h3>
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>File ready for analysis</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => { setResumeText(null); setFileName(""); }}
                    className="h-10"
                  >
                    Replace File
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">ATS Check</p>
                <p className="text-sm font-semibold text-slate-900">Advanced Scan</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">AI Power</p>
                <p className="text-sm font-semibold text-slate-900">Gemini 2.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
