"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Star, 
  Trash2, 
  Settings, 
  Plus, 
  NotebookPen
} from "lucide-react";
import { Button } from "./ui/button";
import { useNotes } from "@/context/NoteContext";

const navItems = [
  { href: "/", icon: LayoutGrid, label: "All Notes" },
  { href: "/favorites", icon: Star, label: "Favorites" },
  { href: "/trash", icon: Trash2, label: "Trash" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { addNote } = useNotes();

  const handleCreateNote = () => {
    const newId = addNote();
    router.push(`/note/${newId}`);
  };

  return (
    <aside className="w-20 lg:w-64 h-screen border-r border-border/40 bg-background/50 backdrop-blur-xl flex flex-col p-4 fixed left-0 top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <NotebookPen className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl hidden lg:block tracking-tight">Lumina</span>
      </div>

      <div className="mb-6">
        <Button onClick={handleCreateNote} className="w-full gap-2 justify-start shadow-xl shadow-primary/20" size="lg">
          <Plus className="w-5 h-5" />
          <span className="hidden lg:block">New Note</span>
        </Button>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <Icon className={cn("w-5 h-5", isActive && "fill-current opacity-50")} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border/40">
        <Link 
            href="/settings"
            className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Settings className="w-5 h-5" />
            <span className="hidden lg:block">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
