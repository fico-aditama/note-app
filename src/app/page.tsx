"use client";

import { useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load notes from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/notes");
        const data = (await res.json()) as Note[];
        setNotes(data);
        if (data.length > 0) {
          const first = data[0];
          setActiveId(first.id);
          setTitle(first.title);
          setContent(first.content);
          setTagsInput(first.tags.join(", "));
        }
      } catch {
        // ignore for now
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter((n) => {
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [notes, search]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeId) ?? null,
    [notes, activeId],
  );

  const handleSelectNote = (id: string) => {
    setActiveId(id);
    const n = notes.find((x) => x.id === id);
    if (!n) return;
    setTitle(n.title);
    setContent(n.content);
    setTagsInput(n.tags.join(", "));
  };

  const handleNewNote = () => {
    setActiveId(null);
    setTitle("");
    setContent("");
    setTagsInput("");
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title.trim() && !content.trim()) return;

    if (activeNote) {
      // update existing
      const updated: Note = {
        ...activeNote,
        title: title || "Untitled note",
        content,
        tags,
        updatedAt: now,
      };
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      void fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } else {
      // create new
      const id = crypto.randomUUID();
      const next: Note = {
        id,
        title: title || "Untitled note",
        content,
        tags,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [next, ...prev]);
      setActiveId(id);
      void fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    }
  };

  const handleDelete = () => {
    if (!activeNote) return;
    const currentIndex = notes.findIndex((n) => n.id === activeNote.id);
    const newNotes = notes.filter((n) => n.id !== activeNote.id);
    setNotes(newNotes);
    void fetch(`/api/notes?id=${encodeURIComponent(activeNote.id)}`, {
      method: "DELETE",
    });

    if (newNotes.length === 0) {
      handleNewNote();
    } else {
      const nextIndex = Math.max(0, currentIndex - 1);
      const next = newNotes[nextIndex];
      setActiveId(next.id);
      setTitle(next.title);
      setContent(next.content);
      setTagsInput(next.tags.join(", "));
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Note App – FSLabsteam
            </h1>
            <p className="text-sm text-zinc-600">
              MVP aplikasi catatan untuk kolaborasi proyek Grafika Komputer.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNewNote}
              className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              + Catatan baru
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-500"
            >
              Simpan
            </button>
            <button
              onClick={handleDelete}
              disabled={!activeNote}
              className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hapus
            </button>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:p-5">
          {/* Sidebar list */}
          <div className="flex w-full flex-col gap-3 border-b border-zinc-200 pb-3 sm:w-72 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, isi, atau tag..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none ring-0 transition focus:border-zinc-400"
              />
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto text-sm">
              {loading ? (
                <p className="text-xs text-zinc-500">Memuat catatan...</p>
              ) : filteredNotes.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  Belum ada catatan. Buat catatan baru untuk mulai.
                </p>
              ) : (
                filteredNotes.map((n) => {
                  const isActive = n.id === activeId;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleSelectNote(n.id)}
                      className={`block w-full rounded-lg px-3 py-2 text-left transition ${
                        isActive
                          ? "bg-zinc-900 text-zinc-50"
                          : "bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-medium">
                          {n.title}
                        </span>
                        {n.tags.length > 0 && (
                          <span className="text-[10px] text-zinc-400">
                            {n.tags.slice(0, 2).join(", ")}
                            {n.tags.length > 2 ? " +" : ""}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-0.5 line-clamp-2 text-[11px] ${
                          isActive ? "text-zinc-200" : "text-zinc-500"
                        }`}
                      >
                        {n.content || "Tanpa isi"}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="flex min-h-[320px] flex-1 flex-col gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul catatan"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-base font-medium outline-none ring-0 transition focus:border-zinc-400"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi catatan di sini. Bisa untuk kebutuhan meeting, keputusan, atau ide fitur."
              className="min-h-[220px] flex-1 resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none ring-0 transition focus:border-zinc-400"
            />

            <div className="flex flex-col gap-2 pt-1 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-1 sm:max-w-md">
                <label className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Pisahkan dengan koma, contoh: meeting, backlog, ui-ux"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs outline-none ring-0 transition focus:border-zinc-400"
                />
              </div>

              {activeNote && (
                <div className="mt-2 text-[11px] text-zinc-500 sm:mt-6 sm:text-right">
                  <div>
                    Dibuat:{" "}
                    {new Date(activeNote.createdAt).toLocaleString("id-ID")}
                  </div>
                  <div>
                    Diupdate:{" "}
                    {new Date(activeNote.updatedAt).toLocaleString("id-ID")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
