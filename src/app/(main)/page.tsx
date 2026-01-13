"use client";

import { SearchBar } from "@/components/SearchBar";
import { NoteCard } from "@/components/NoteCard";
import { useNotes } from "@/context/NoteContext";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");

  const activeNotes = notes.filter(n => !n.isTrash);
  const filteredNotes = activeNotes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/40"
      >
        <div>
           <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
           <p className="text-muted-foreground mt-1">Remember everything important.</p>
        </div>
        <div className="w-full md:w-96">
            <SearchBar 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
        ))}
        
        {filteredNotes.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center text-muted-foreground"
            >
                {searchQuery ? "No notes found matching your search." : "No notes here. Create your first one!"}
            </motion.div>
        )}
      </div>
    </div>
  );
}
