import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { seedNewClinic } from "@/lib/seed-clinic";
import { sendWelcomeEmail } from "@/lib/send-email";

interface RegisterBody {
  clinic_name:   string;
  phone:         string;
  city:          string;
  working_hours: string;
  full_name:     string;
  email:         string;
  password:      string;
  slug:          string;
  plan:          "starter" | "pro" | "enterprise";
}

function trialEnd(plan: string): string {
  const days = plan === "starter" ? 14 : plan === "pro" ? 7 : 30;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export async function POST(request: NextRequest) {
  const body = await request.json() as RegisterBody;
  const { clinic_name, phone, city, working_hours, full_name, email, password, slug, plan } = body;

  // Basic validation
  if (!clinic_name || !email || !password || !slug || !plan) {
    return NextResponse.json({ error: "Barcha majburiy maydonlarni to'ldiring" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Parol kamida 8 ta belgi bo'lishi kerak" }, { status: 400 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // ── 1. Check slug availability ─────────────────────────────────────────────
  const { data: existingClinic } = await (adminClient
    .from("clinics" as never)
    .select("id")
    .eq("slug" as never, slug)
    .maybeSingle() as unknown as Promise<{ data: { id: string } | null }>);

  if (existingClinic) {
    return NextResponse.json({ error: "Bu subdomain allaqachon band" }, { status: 409 });
  }

  // ── 2. Check email availability ────────────────────────────────────────────
  const { data: { users } } = await adminClient.auth.admin.listUsers();
  const emailTaken = users.some((u) => u.email === email);
  if (emailTaken) {
    return NextResponse.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 409 });
  }

  // ── 3. Create clinic record ────────────────────────────────────────────────
  const { data: clinic, error: clinicErr } = await (adminClient
    .from("clinics" as never)
    .insert({
      name:          clinic_name,
      slug,
      phone:         phone || null,
      city:          city  || null,
      owner_email:   email,
      plan,
      is_active:     true,
      trial_ends_at: trialEnd(plan),
      settings:      { working_hours: working_hours || null },
    } as never)
    .select("id")
    .single() as unknown as Promise<{ data: { id: string } | null; error: { message: string } | null }>);

  if (clinicErr || !clinic) {
    console.error("[register] clinic insert error:", clinicErr?.message);
    return NextResponse.json({ error: "Klinika yaratishda xatolik: " + clinicErr?.message }, { status: 500 });
  }

  // ── 4. Create Supabase Auth user ───────────────────────────────────────────
  const { data: authUser, error: authErr } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr || !authUser.user) {
    console.error("[register] auth create error:", authErr?.message);
    return NextResponse.json({ error: "Foydalanuvchi yaratishda xatolik: " + authErr?.message }, { status: 500 });
  }

  // ── 5. Create staff_users record ───────────────────────────────────────────
  const { error: staffErr } = await (adminClient
    .from("staff_users" as never)
    .insert({
      email,
      full_name: full_name || email.split("@")[0],
      role:      "admin",
      clinic_id: clinic.id,
      is_active: true,
    } as never) as unknown as Promise<{ error: { message: string } | null }>);

  if (staffErr) {
    console.error("[register] staff insert error:", staffErr.message);
    // Non-fatal — clinic + auth user exist, staff can be created manually
  }

  // ── 6. Seed default data ───────────────────────────────────────────────────
  try {
    await seedNewClinic(clinic.id, slug, clinic_name);
  } catch (e) {
    console.error("[register] seed error:", e);
    // Non-fatal
  }

  // ── 7. Welcome email ───────────────────────────────────────────────────────
  await sendWelcomeEmail({ to: email, clinicName: clinic_name, slug, adminName: full_name, plan });

  return NextResponse.json({
    success:    true,
    clinic_url: `https://${slug}.dentaflow.uz`,
    clinic_id:  clinic.id,
  });
}
