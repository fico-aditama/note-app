import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH =
  process.env.SQLITE_DB_PATH ??
  path.join(process.cwd(), "data", "notes.sqlite3");

let db: Database.Database | null = null;

function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getDb() {
  if (!db) {
    ensureDirExists(DB_PATH);
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }
  return db;
}

function seedIfEmpty() {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(1) as count FROM notes").get() as {
    count: number;
  };

  if (row.count > 0) return;

  const now = new Date().toISOString();

  const samples: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
  }> = [
    {
      id: "sample-1",
      title: "Note App Kickoff",
      content:
        "- Goal: note app to capture meetings and decisions.\n- Stack: Next.js + SQLite.\n- MVP: CRUD notes, search, and tags.",
      tags: ["meeting", "planning", "mvp"],
    },
    {
      id: "sample-2",
      title: "Sample Meeting Note",
      content:
        "Agenda:\n1. Confirm core feature needs.\n2. Decide visual style (light/dark mode).\n3. Deployment plan.\n\nDecisions:\n- Use Nova Notes as working name.\n- Store data locally via SQLite.",
      tags: ["meeting", "requirements"],
    },
    {
      id: "sample-3",
      title: "Future Feature Backlog",
      content:
        "- Multi-user support and auth.\n- Export notes to Markdown/PDF.\n- Calendar integration for reminders.\n- Color labels per tag.",
      tags: ["backlog", "idea"],
    },
  ];

  const insert = db.prepare(
    `INSERT INTO notes (id, title, content, tags, created_at, updated_at)
     VALUES (@id, @title, @content, @tags, @createdAt, @updatedAt)`,
  );

  const tx = db.transaction(() => {
    for (const s of samples) {
      insert.run({
        id: s.id,
        title: s.title,
        content: s.content,
        tags: JSON.stringify(s.tags),
        createdAt: now,
        updatedAt: now,
      });
    }
  });

  tx();
}

export type DbNoteRow = {
  id: string;
  title: string;
  content: string;
  tags: string;
  created_at: string;
  updated_at: string;
};

export function getAllNotes(): DbNoteRow[] {
  const db = getDb();
  seedIfEmpty();
  const stmt = db.prepare<[], DbNoteRow>("SELECT * FROM notes ORDER BY updated_at DESC");
  return stmt.all();
}

export function getNoteById(id: string): DbNoteRow | undefined {
  const db = getDb();
  const stmt = db.prepare<[string], DbNoteRow>("SELECT * FROM notes WHERE id = ?");
  return stmt.get(id);
}

export function createNote(data: {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}): void {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO notes (id, title, content, tags, created_at, updated_at)
     VALUES (@id, @title, @content, @tags, @createdAt, @updatedAt)`,
  );
  stmt.run({
    ...data,
    tags: JSON.stringify(data.tags),
  });
}

export function updateNote(data: {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
}): void {
  const db = getDb();
  const stmt = db.prepare(
    `UPDATE notes
     SET title = @title,
         content = @content,
         tags = @tags,
         updated_at = @updatedAt
     WHERE id = @id`,
  );
  stmt.run({
    ...data,
    tags: JSON.stringify(data.tags),
  });
}

export function deleteNote(id: string): void {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM notes WHERE id = ?");
  stmt.run(id);
}


