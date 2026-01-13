import { NextRequest, NextResponse } from "next/server";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "@/lib/db";

export const dynamic = "force-dynamic";

type ApiNote = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

function rowToNote(row: {
  id: string;
  title: string;
  content: string;
  tags: string;
  created_at: string;
  updated_at: string;
}): ApiNote {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: JSON.parse(row.tags ?? "[]"),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  const rows = getAllNotes();
  return NextResponse.json(rows.map(rowToNote));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<ApiNote>;

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const note: ApiNote = {
    id: body.id,
    title: body.title?.trim() || "Untitled note",
    content: body.content ?? "",
    tags: body.tags ?? [],
    createdAt: body.createdAt ?? now,
    updatedAt: now,
  };

  createNote({
    id: note.id,
    title: note.title,
    content: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });

  return NextResponse.json(note, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = (await req.json()) as Partial<ApiNote>;

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const now = new Date().toISOString();

  updateNote({
    id: body.id,
    title: body.title?.trim() || "Untitled note",
    content: body.content ?? "",
    tags: body.tags ?? [],
    updatedAt: now,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  deleteNote(id);
  return NextResponse.json({ ok: true });
}























































