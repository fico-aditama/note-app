"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Save, MoreVertical, Share2, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function NoteEditor({ initialData }: { initialData?: any }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [saving, setSaving] = useState(false);

  // Simulate auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
        if (title || content) {
            setSaving(true);
            setTimeout(() => setSaving(false), 1000);
        }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] relative">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-4">
            <Link href="/" className="md:hidden">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </Link>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Saved just now"}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Star className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
                <MoreVertical className="w-5 h-5" />
            </Button>
            <Button className="hidden md:flex">Done</Button>
        </div>
      </div>

      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled Note"
        className="text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 w-full mb-4"
      />

      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-lg leading-relaxed text-foreground resize-none p-0"
      />
    </div>
  );
}
