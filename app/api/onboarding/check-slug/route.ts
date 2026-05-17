import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";

  if (!slug || slug.length < 3) {
    return NextResponse.json({ available: false });
  }

  // Reserved slugs
  const RESERVED = ["admin", "www", "api", "test", "demo", "dentaflow", "support", "mail"];
  if (RESERVED.includes(slug)) {
    return NextResponse.json({ available: false });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data } = await (adminClient
    .from("clinics" as never)
    .select("id")
    .eq("slug" as never, slug)
    .maybeSingle() as unknown as Promise<{ data: { id: string } | null }>);

  return NextResponse.json({ available: data === null });
}
