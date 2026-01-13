"use client";

import Link from "next/link";
// import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Note } from "@/context/NoteContext";

interface NoteCardProps {
  note: Note;
  index: number;
}

export function NoteCard({ note, index }: NoteCardProps) {
  const dateString = new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(new Date(note.updatedAt));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/note/${note.id}`} className="block group">
        <div className="h-full p-6 rounded-2xl bg-card border border-border/40 transition-colors duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {note.title || "Untitled Note"}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {note.content || "No content"}
            </p>
          </div>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
              <div className="flex gap-2">
                  {note.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/50">{tag}</Badge>
                  ))}
                  {note.tags.length > 2 && (
                      <Badge variant="secondary" className="bg-secondary/50">+{note.tags.length - 2}</Badge>
                  )}
              </div>
              <span className="text-xs text-muted-foreground font-medium">{dateString}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
