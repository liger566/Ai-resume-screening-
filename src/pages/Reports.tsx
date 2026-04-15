import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { HistoryItem } from "../types";
import { motion } from "motion/react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Download, 
  ChevronLeft, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Map,
  Sparkles,
  FileText
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from "recharts";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Reports() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const docRef = doc(db, "analyses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as HistoryItem);
        } else {
          toast.error("Report not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, navigate]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    const toastId = toast.loading("Generating PDF report...");
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#F8FAFC"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HireSense-Report-${data?.role}-${id?.slice(0, 5)}.pdf`);
      toast.success("Report downloaded!", { id: toastId });
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) return null;

  const radarData = data.skillStrengths.map(s => ({
    subject: s.name,
    A: s.score,
    fullMark: 100
  }));

  const pieData = [
    { name: "Found", value: data.skillsFound.length, color: "#10B981" },
    { name: "Missing", value: data.missingSkills.length, color: "#EF4444" }
  ];

  const getJobRecommendation = (score: number) => {
    if (score >= 80) return { label: "Senior / Lead Roles", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 50) return { label: "Mid-Level Roles", color: "text-blue-600", bg: "bg-blue-50" };
    return { label: "Entry-Level / Junior Roles", color: "text-amber-600", bg: "bg-amber-50" };
  };

  const recommendation = getJobRecommendation(data.score);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md py-4 z-10">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <Button onClick={downloadPDF} className="gap-2 shadow-lg shadow-primary/20">
          <Download className="w-4 h-4" /> Download HR-Style PDF
        </Button>
      </div>

      <div ref={reportRef} className="space-y-8 p-1">
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * data.score) / 100}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">{data.score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{data.role}</h1>
              <p className="text-slate-500 font-medium">{data.fileName}</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Badge variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 font-bold">
                ATS COMPLIANT
              </Badge>
              <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${recommendation.bg} ${recommendation.color}`}>
                {recommendation.label}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ATS Breakdown */}
          <Card className="shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> ATS Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {Object.entries(data.atsBreakdown).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span className="capitalize">{key}</span>
                    <span>{value as number}%</span>
                  </div>
                  <Progress value={value as number} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Strength Radar */}
          <Card className="lg:col-span-2 shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Target className="w-4 h-4" /> Skill Strength Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#F1F5F9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#2563EB"
                    fill="#2563EB"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Skill Gap Analyzer */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Skill Gap Analyzer
            </CardTitle>
            <CardDescription>Direct comparison between your resume and the job requirements.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skillsFound.map(skill => (
                  <Badge key={skill} variant="outline" className="bg-green-50 text-green-700 border-green-100 px-3 py-1 font-medium">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.missingSkills.map(skill => (
                  <Badge key={skill} variant="outline" className="bg-red-50 text-red-700 border-red-100 px-3 py-1 font-medium">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Roadmap */}
        <Card className="shadow-sm border-slate-100 overflow-hidden">
          <CardHeader className="bg-slate-900 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Map className="w-5 h-5" /> Career Roadmap
            </CardTitle>
            <CardDescription className="text-slate-400">Step-by-step guide to landing this role.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {data.careerRoadmap.map((step, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500">
                    {index + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
                    <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resume Rewrite AI */}
        <Card className="shadow-sm border-slate-100 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Resume Rewrite AI
            </CardTitle>
            <CardDescription>AI-enhanced content for maximum impact.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {data.improvedSummary && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Improved Summary</h3>
                <div className="p-6 rounded-2xl bg-white border border-slate-100 italic text-slate-700 leading-relaxed shadow-sm">
                  "{data.improvedSummary}"
                </div>
              </div>
            )}
            {data.improvedBullets && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Key Achievements (Improved)</h3>
                <ul className="space-y-3">
                  {data.improvedBullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
