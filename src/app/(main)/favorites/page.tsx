"use client";

import { SearchBar } from "@/components/SearchBar";
import { NoteCard } from "@/components/NoteCard";
import { useNotes } from "@/context/NoteContext";
import { motion } from "framer-motion";

export default function Favorites() {
  const { notes } = useNotes();
  const favoriteNotes = notes.filter(n => n.isFavorite && !n.isTrash);

  return (
    <div className="space-y-8">
      <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/40"
      >
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
           <p className="text-muted-foreground mt-1">Your starred notes.</p>
        </div>
        <div className="w-full md:w-96">
            <SearchBar />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {favoriteNotes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
        ))}
        {favoriteNotes.length === 0 && (
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center text-muted-foreground"
            >
                No favorites yet. Star a note to see it here!
            </motion.div>
        )}
      </div>
    </div>
  );
}
