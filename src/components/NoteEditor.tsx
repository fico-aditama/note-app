"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock, Save, MoreVertical, Share2, Star, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useNotes } from "@/context/NoteContext";

export function NoteEditor({ initialId }: { initialId: string }) {
  const router = useRouter();
  const { getNote, updateNote, toggleFavorite, deleteNote } = useNotes();
  
  // Fetch note from context
  const note = getNote(initialId);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize state when note loads
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // Auto-save logic
  const handleSave = useCallback(() => {
     if (!note) return;
     setSaving(true);
     updateNote(initialId, { title, content });
     setTimeout(() => setSaving(false), 800);
  }, [note, initialId, title, content, updateNote]);

  // Debounce save
  useEffect(() => {
    const timer = setTimeout(() => {
        if (note && (title !== note.title || content !== note.content)) {
            handleSave();
        }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, note, handleSave]);

  if (!note) {
      return (
          <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
              <p>Note not found.</p>
              <Link href="/"><Button variant="ghost">Go Home</Button></Link>
          </div>
      )
  }

  const handleDelete = () => {
      deleteNote(initialId);
      router.push("/");
  }

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
                <span>{saving ? "Saving..." : "Saved"}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleFavorite(initialId)}
                className={note.isFavorite ? "text-yellow-500" : ""}
            >
                <Star className={note.isFavorite ? "fill-current" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
                <Trash className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
            </Button>
            <Button onClick={() => router.push("/")} className="hidden md:flex">Done</Button>
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
