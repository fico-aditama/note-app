import { SearchBar } from "@/components/SearchBar";
import { NoteCard } from "@/components/NoteCard";
// import { Button } from "@/components/ui/button"; // Not used in this header yet, sidebar has the create button.

// Mock Data
const MOCK_NOTES = [
    {
        id: "1",
        title: "Project Ideas 2024",
        content: "1. AI Note Taking App\n2. Smart Home Dashboard\n3. Personal Finance Tracker with ML",
        updatedAt: new Date(),
        tags: ["Work", "Ideas"]
    },
    {
        id: "2",
        title: "Grocery List",
        content: "- Milk\n- Eggs\n- Bread\n- Avocados\n- Coffee Beans",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        tags: ["Personal"]
    },
    {
        id: "3",
        title: "Meeting Notes: Design Review",
        content: "Attendees: Sarah, John, Mike.\n\nAction items:\n- Update color palette\n- Fix mobile responsiveness\n- Deploy to staging",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        tags: ["Work", "Meeting"]
    },
    {
        id: "4",
        title: "Travel Plans: Japan",
        content: "Itinerary:\nDay 1: Tokyo Arrival\nDay 2: Shibuya & Harajuku\nDay 3: Kyoto Shinkansen",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        tags: ["Travel", "Personal"]
    },
    {
        id: "5",
        title: "Book Recommendations",
        content: "Read 'Atomic Habits' by James Clear. Also 'The Psychology of Money'.",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
        tags: ["Reading"]
    },
    {
        id: "6",
        title: "React Server Components",
        content: "Researching how RSCs work in Next.js 15. Key concepts: Streaming, Suspense, Server Actions.",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), 
        tags: ["Dev", "Learning"]
    }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-border/40">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
           <p className="text-muted-foreground mt-1">Remember everything important.</p>
        </div>
        <div className="w-full md:w-96">
            <SearchBar />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_NOTES.map(note => (
            <NoteCard key={note.id} note={note} />
        ))}
        
        {/* Empty state visual enhancement text if needed */}
        {MOCK_NOTES.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
                No notes found. Create your first one!
            </div>
        )}
      </div>
    </div>
  );
}
