import { Rocket, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onReset: () => void;
  onLogout: () => void;
}

export function Navbar({ onReset, onLogout }: NavbarProps) {
  return (
    <nav className="h-16 bg-card border-b border-border sticky top-0 z-50 w-full flex items-center justify-between px-8 flex-shrink-0">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={onReset}
      >
        <span className="text-xl">🚀</span>
        <span className="text-lg font-bold tracking-tight text-primary">ResumeIntelligence AI</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="hidden md:flex items-center gap-2">
          <span>Welcome, <strong>User</strong></span>
          <div className="w-8 h-8 bg-muted border border-border rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-xs font-semibold" onClick={onLogout}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </nav>
  );
}
