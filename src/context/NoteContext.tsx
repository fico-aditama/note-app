"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  tags: string[];
  isFavorite: boolean;
  isTrash: boolean;
}

interface NoteContextType {
  notes: Note[];
  addNote: () => string; // Returns new note ID
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void; // Moves to trash
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getNote: (id: string) => Note | undefined;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_NOTES: Note[] = [
    {
        id: "1",
        title: "Project Ideas 2024",
        content: "1. AI Note Taking App\n2. Smart Home Dashboard\n3. Personal Finance Tracker with ML",
        updatedAt: new Date(),
        tags: ["Work", "Ideas"],
        isFavorite: true,
        isTrash: false
    },
    {
        id: "2",
        title: "Grocery List",
        content: "- Milk\n- Eggs\n- Bread\n- Avocados\n- Coffee Beans",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        tags: ["Personal"],
        isFavorite: false,
        isTrash: false
    },
    {
        id: "3",
        title: "Meeting Notes: Design Review",
        content: "Attendees: Sarah, John, Mike.\n\nAction items:\n- Update color palette\n- Fix mobile responsiveness\n- Deploy to staging",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        tags: ["Work", "Meeting"],
        isFavorite: false,
        isTrash: false
    },
    {
      id: "99",
      title: "Old Shopping List",
      content: "Milk, Bread, Cheese...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      tags: ["Personal"],
      isFavorite: false,
      isTrash: true
    }
];

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  const addNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      content: "",
      updatedAt: new Date(),
      tags: [],
      isFavorite: false,
      isTrash: false,
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    updateNote(id, { isTrash: true });
  };

  const restoreNote = (id: string) => {
    updateNote(id, { isTrash: false });
  };

  const permanentlyDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  const getNote = (id: string) => {
    return notes.find((n) => n.id === id);
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        restoreNote,
        permanentlyDeleteNote,
        toggleFavorite,
        getNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
}
