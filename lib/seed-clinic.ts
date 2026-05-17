import { createClient } from "@supabase/supabase-js";

export async function seedNewClinic(clinicId: string, slug: string, clinicName: string) {
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  await (adminClient.from("services" as never).insert([
    { clinic_id: clinicId, name_uz: "Tish oqlash",               name_ru: "Отбеливание",          name_en: "Whitening",      price: 250000,  duration_minutes: 60,  category: "Estetik",   is_visible: true },
    { clinic_id: clinicId, name_uz: "Implantatsiya",              name_ru: "Имплантация",           name_en: "Implantology",   price: 3500000, duration_minutes: 120, category: "Jarrohlik", is_visible: true },
    { clinic_id: clinicId, name_uz: "Ortodontiya",                name_ru: "Ортодонтия",            name_en: "Orthodontics",   price: 1800000, duration_minutes: 60,  category: "Tuzatish",  is_visible: true },
    { clinic_id: clinicId, name_uz: "Profilaktika",               name_ru: "Профилактика",          name_en: "Prevention",     price: 120000,  duration_minutes: 30,  category: "Umumiy",    is_visible: true },
    { clinic_id: clinicId, name_uz: "Kanal davolash",             name_ru: "Каналотерапия",         name_en: "Root Canal",     price: 350000,  duration_minutes: 90,  category: "Davolash",  is_visible: true },
    { clinic_id: clinicId, name_uz: "Bolalar stomatologiyasi",    name_ru: "Детская стоматология",  name_en: "Pediatric",      price: 100000,  duration_minutes: 30,  category: "Bolalar",   is_visible: true },
  ] as never[]));

  await (adminClient.from("cms_content" as never).insert([
    { clinic_id: clinicId, section: "hero",    key: "title_uz",  value_uz: `${clinicName} — professional stomatologiya` },
    { clinic_id: clinicId, section: "hero",    key: "patients",  value_uz: "0+" },
    { clinic_id: clinicId, section: "hero",    key: "years",     value_uz: "1+" },
    { clinic_id: clinicId, section: "hero",    key: "rating",    value_uz: "5.0" },
    { clinic_id: clinicId, section: "contact", key: "phone",     value_uz: "+998 90 000 00 00" },
    { clinic_id: clinicId, section: "contact", key: "hours_uz",  value_uz: "Dushanba-Shanba: 09:00-18:00" },
    { clinic_id: clinicId, section: "brand",   key: "name",      value_uz: clinicName },
  ] as never[]));
}
