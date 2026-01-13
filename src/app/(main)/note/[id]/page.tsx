"use client";

import { NoteEditor } from "@/components/NoteEditor"; // Updated import
import { use } from "react";

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15+, params is a Promise. We need to unwrap it.
  const resolvedParams = use(params);
  
  return <NoteEditor initialId={resolvedParams.id} />;
}
