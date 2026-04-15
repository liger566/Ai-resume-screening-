import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Home, 
  FileSearch, 
  LayoutDashboard, 
  BarChart3, 
  User, 
  MessageSquare,
  LogOut,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileSearch, label: "Analyzer", path: "/analyzer" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: MessageSquare, label: "AI Chat", path: "/chat" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">HireSense AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 transition-all duration-200 ${
                    isActive ? "bg-slate-100 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
