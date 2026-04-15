import { AnalysisResult } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Lightbulb, Target, FileText } from "lucide-react";
import { motion } from "motion/react";

interface AnalysisDisplayProps {
  result: AnalysisResult;
  fileName: string;
}

export function AnalysisDisplay({ result, fileName }: AnalysisDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div variants={itemVariants}>
          <Card className="text-center p-6 shadow-sm border-border h-full flex flex-col justify-center hover:shadow-md transition-shadow">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-4xl font-extrabold text-primary mb-1"
            >
              {result.score}%
            </motion.div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">ATS Compatibility</div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="text-center p-6 shadow-sm border-border h-full flex flex-col justify-center items-center hover:shadow-md transition-shadow">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D1FAE5] text-[#065F46] mb-3"
            >
              {result.score > 80 ? "Strong Match" : result.score > 60 ? "Good Match" : "Needs Work"}
            </motion.div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Recommended Role</div>
            <div className="text-sm font-bold text-foreground">{result.recommendedRoles[0] || "N/A"}</div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="text-center p-6 shadow-sm border-border h-full flex flex-col justify-center items-center hover:shadow-md transition-shadow">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-2xl font-bold text-foreground mb-1"
            >
              {result.skillsFound.length}
            </motion.div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Skills Identified</div>
            <div className="flex flex-wrap justify-center gap-1">
              {result.skillsFound.slice(0, 3).map((skill, idx) => (
                <motion.span 
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + (idx * 0.1) }}
                  className="inline-block bg-[#DBEAFE] text-primary px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-border flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              >
                🤖
              </motion.span>
              AI Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="bg-[#F9FAFB] border border-border rounded-lg p-5 text-sm leading-relaxed text-foreground space-y-4"
            >
              <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap">
                {result.suggestions}
              </div>
              
              {result.missingSkills.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="pt-4 border-t border-border"
                >
                  <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Keyword Gap Analysis</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill, idx) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + (idx * 0.05) }}
                      >
                        <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5 text-[10px] font-bold uppercase">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
