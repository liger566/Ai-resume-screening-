import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { HistoryItem, JobRole, JOB_ROLES_JD } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2, Calendar, Award, FileText, Search, Filter, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalysisHistoryProps {
  userId: string;
  onSelect: (item: HistoryItem) => void;
}

export function AnalysisHistory({ userId, onSelect }: AnalysisHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "score-desc" | "score-asc">("date-desc");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    const q = query(
      collection(db, "analyses"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryItem[];
      setHistory(items);
      setLoading(false);
    }, (error) => {
      console.error("History fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const filteredHistory = history
    .filter(item => filterRole === "all" || item.role === filterRole)
    .sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      
      switch (sortBy) {
        case "date-desc": return dateB - dateA;
        case "date-asc": return dateA - dateB;
        case "score-desc": return b.score - a.score;
        case "score-asc": return a.score - b.score;
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter className="h-3 w-3" /> Filter by Role
            </label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-9 w-full md:w-[180px] text-xs">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.keys(JOB_ROLES_JD).map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown className="h-3 w-3" /> Sort By
            </label>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-9 w-full md:w-[180px] text-xs">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="score-desc">Highest Score</SelectItem>
                <SelectItem value="score-asc">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Analyses</p>
          <p className="text-2xl font-black text-primary">{filteredHistory.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  className="group hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
                  onClick={() => onSelect(item)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-stretch h-full">
                      <div className={`w-2 ${item.score > 80 ? 'bg-green-500' : item.score > 60 ? 'bg-amber-500' : 'bg-destructive'}`} />
                      <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
                              {item.role}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {item.createdAt?.toDate().toLocaleDateString() || "Recent"}
                            </span>
                          </div>
                          <h3 className="font-bold text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {item.fileName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match Score</p>
                            <p className={`text-2xl font-black ${item.score > 80 ? 'text-green-600' : item.score > 60 ? 'text-amber-600' : 'text-destructive'}`}>
                              {item.score}%
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card rounded-xl border border-dashed border-border"
            >
              <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">No history found</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                {filterRole !== "all" 
                  ? `You haven't analyzed any resumes for the ${filterRole} role yet.` 
                  : "Start by analyzing your first resume to see your history here."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
