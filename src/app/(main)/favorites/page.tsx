import { SearchBar } from "@/components/SearchBar";
import { NoteCard } from "@/components/NoteCard";

const FAVORITE_NOTES = [
    {
        id: "1",
        title: "Project Ideas 2024",
        content: "1. AI Note Taking App\n2. Smart Home Dashboard\n3. Personal Finance Tracker with ML",
        updatedAt: new Date(),
        tags: ["Work", "Ideas"]
    },
    {
        id: "4",
        title: "Travel Plans: Japan",
        content: "Itinerary:\nDay 1: Tokyo Arrival\nDay 2: Shibuya & Harajuku\nDay 3: Kyoto Shinkansen",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        tags: ["Travel", "Personal"]
    }
];

export default function Favorites() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/40">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
           <p className="text-muted-foreground mt-1">Your starred notes.</p>
        </div>
        <div className="w-full md:w-96">
            <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {FAVORITE_NOTES.map(note => (
            <NoteCard key={note.id} note={note} />
        ))}
        {FAVORITE_NOTES.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
                No favorites yet. Star a note to see it here!
            </div>
        )}
      </div>
    </div>
  );
}
