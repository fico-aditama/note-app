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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-500/40">
              <span className="text-lg font-semibold text-sky-300">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Nova Notes
              </h1>
              <p className="text-xs text-slate-400">
                Panel catatan cepat untuk merangkum ide, meeting, dan keputusan.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="rounded-full bg-slate-900/60 px-2 py-1 ring-1 ring-slate-700/60">
              ⌘/Ctrl + K — fokus ke pencarian
            </span>
            <span className="rounded-full bg-slate-900/60 px-2 py-1 ring-1 ring-slate-700/60">
              ⌘/Ctrl + S — simpan catatan
            </span>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-4 rounded-3xl bg-slate-950/60 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.55)] ring-1 ring-slate-800/80 backdrop-blur-xl sm:flex-row sm:p-5">
          {/* Sidebar list */}
          <div className="flex w-full flex-col gap-3 border-b border-slate-800/80 pb-3 sm:w-72 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, isi, atau tag..."
                className="w-full rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-2 ring-transparent transition focus:border-sky-500/60 focus:ring-sky-500/20"
              />
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto text-sm">
              {loading ? (
                <p className="text-xs text-slate-500">Memuat catatan...</p>
              ) : filteredNotes.length === 0 ? (
                <p className="text-xs text-slate-500">
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
                          ? "bg-sky-500/15 text-slate-50 ring-1 ring-sky-500/60"
                          : "bg-slate-900/60 text-slate-200 hover:bg-slate-900 ring-1 ring-transparent hover:ring-slate-700/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-medium tracking-tight">
                          {n.title}
                        </span>
                        {n.tags.length > 0 && (
                          <span className="text-[10px] text-slate-400">
                            {n.tags.slice(0, 2).join(", ")}
                            {n.tags.length > 2 ? " +" : ""}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-0.5 line-clamp-2 text-[11px] ${
                          isActive ? "text-slate-200" : "text-slate-500"
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul catatan"
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-2.5 text-base font-medium text-slate-50 outline-none ring-2 ring-transparent transition focus:border-sky-500/60 focus:ring-sky-500/20"
              />
              <div className="mt-1 flex gap-2 sm:mt-0">
                <button
                  onClick={handleNewNote}
                  className="inline-flex items-center rounded-2xl bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 shadow-sm ring-1 ring-slate-700/80 transition hover:bg-slate-800"
                >
                  + Baru
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center rounded-2xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(15,23,42,0.8)] transition hover:bg-sky-400"
                >
                  Simpan
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!activeNote}
                  className="inline-flex items-center rounded-2xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Hapus
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis isi catatan di sini. Cocok untuk rangkuman meeting, keputusan penting, atau ide fitur."
              className="min-h-[220px] flex-1 resize-none rounded-2xl border border-slate-800/80 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none ring-2 ring-transparent transition focus:border-sky-500/60 focus:ring-sky-500/20"
            />

            <div className="flex flex-col gap-2 pt-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-1 sm:max-w-md">
                <label className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Tags
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Pisahkan dengan koma, contoh: meeting, backlog, ui-ux"
                  className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-100 outline-none ring-2 ring-transparent transition focus:border-sky-500/60 focus:ring-sky-500/20"
                />
              </div>

              {activeNote && (
                <div className="mt-2 text-[11px] text-slate-500 sm:mt-6 sm:text-right">
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
