import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  FileSearch, 
  Target, 
  TrendingUp, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: FileSearch,
      title: "AI Resume Analysis",
      description: "Get instant feedback on your resume with our advanced AI engine."
    },
    {
      icon: Target,
      title: "Skill Gap Analyzer",
      description: "Compare your resume against any job role to find missing skills."
    },
    {
      icon: TrendingUp,
      title: "Career Roadmap",
      description: "Get a step-by-step guide to reach your dream career goals."
    },
    {
      icon: ShieldCheck,
      title: "ATS Optimization",
      description: "Ensure your resume passes through Applicant Tracking Systems."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-20 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Future of Career Optimization</span>
        </motion.div>
        
        <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Land Your Dream Job with <br />
          <span className="text-primary">HireSense AI</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Professional AI Career Platform for resume optimization, skill gap analysis, and personalized career roadmapping.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/analyzer">
            <Button size="lg" className="h-14 px-8 text-lg font-semibold gap-2 shadow-lg shadow-primary/20">
              Start Analysis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              <feature.icon className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 rounded-[2rem] p-12 text-white grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-4xl font-bold">98%</div>
          <div className="text-slate-400">ATS Pass Rate</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold">10k+</div>
          <div className="text-slate-400">Resumes Analyzed</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold">2.5x</div>
          <div className="text-slate-400">More Interview Calls</div>
        </div>
      </section>
    </div>
  );
}
