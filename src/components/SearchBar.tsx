"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ containerClassName, className, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative group", containerClassName)}>
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
        </div>
        <input 
            type="text"
            className={cn(
                "w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border-transparent focus:bg-background border focus:border-primary/50 ring-offset-background transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:shadow-lg focus:shadow-primary/5",
                className
            )}
            placeholder="Search notes..."
            {...props}
        />
    </div>
  );
}
