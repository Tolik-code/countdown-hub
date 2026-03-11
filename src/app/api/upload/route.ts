import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use PNG, JPEG, or WebP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Max 2MB." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("countdown-backgrounds")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error.message, error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from("countdown-backgrounds")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}
