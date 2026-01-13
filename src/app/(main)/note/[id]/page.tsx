import { NoteEditor } from "@/components/NoteEditor";

// Mock fetching data based on ID
// In a real app this would be `params` and `async` fetching
export default function NotePage( { params }: { params: { id: string } } ) {
  // We can just pass mock data for demonstration
  const mockNote = {
    title: "Project Ideas 2024",
    content: "1. AI Note Taking App\n2. Smart Home Dashboard\n3. Personal Finance Tracker with ML"
  };

  return <NoteEditor initialData={mockNote} />;
}
