import { SearchBar } from "@/components/SearchBar";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

// Mock trash data
const TRASH_NOTES: any[] = [
    // Empty for visual variety, or add one if I want. Let's add one.
    {
        id: "99",
        title: "Old Shopping List",
        content: "Milk, Bread, Cheese...",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        tags: ["Personal"]
    }
];

export default function TrashPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/40">
        <div>
           <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trash className="w-8 h-8 text-destructive" />
            Trash
           </h1>
           <p className="text-muted-foreground mt-1">Notes in trash are deleted after 30 days.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Empty Trash</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TRASH_NOTES.map(note => (
            <NoteCard key={note.id} note={note} />
        ))}
        {TRASH_NOTES.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
                Trash is empty.
            </div>
        )}
      </div>
    </div>
  );
}
