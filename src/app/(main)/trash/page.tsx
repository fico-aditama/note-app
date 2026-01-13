"use client";

import { SearchBar } from "@/components/SearchBar";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useNotes } from "@/context/NoteContext";
import { motion } from "framer-motion";

export default function TrashPage() {
  const { notes, permanentlyDeleteNote } = useNotes();
  const trashNotes = notes.filter(n => n.isTrash);

  return (
    <div className="space-y-8">
      <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/40"
      >
        <div>
           <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trash className="w-8 h-8 text-destructive" />
            Trash
           </h1>
           <p className="text-muted-foreground mt-1">Notes in trash are deleted after 30 days.</p>
        </div>
        <div className="flex gap-2">
             {/* Logic to empty trash could go here */}
            <Button variant="outline" disabled={trashNotes.length === 0}>Empty Trash</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {trashNotes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index}/>
        ))}
        {trashNotes.length === 0 && (
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center text-muted-foreground"
             >
                Trash is empty.
            </motion.div>
        )}
      </div>
    </div>
  );
}
