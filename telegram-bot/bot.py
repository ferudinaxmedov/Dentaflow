import asyncio
import logging
import os

from aiogram import Bot, Dispatcher, Router, F
from aiogram.types import (
    Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove,
)
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN    = os.getenv("BOT_TOKEN", "")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

bot     = Bot(token=BOT_TOKEN)
storage = MemoryStorage()
dp      = Dispatcher(storage=storage)
router  = Router()
dp.include_router(router)


# ── FSM states ─────────────────────────────────────────────────────────────

class DemoForm(StatesGroup):
    clinic_name = State()
    phone       = State()
    city        = State()
    plan        = State()

class QuestionForm(StatesGroup):
    question = State()


# ── Keyboards ──────────────────────────────────────────────────────────────

def main_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🚀 Bepul sinov boshlash")],
            [KeyboardButton(text="📋 Tariflar va narxlar")],
            [KeyboardButton(text="🎯 Demo so'rash")],
            [KeyboardButton(text="❓ Savol berish")],
            [KeyboardButton(text="📞 Bog'lanish")],
        ],
        resize_keyboard=True,
    )

def cancel_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="❌ Bekor qilish")]],
        resize_keyboard=True,
    )

def plan_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🥈 Starter"), KeyboardButton(text="⭐ Pro")],
            [KeyboardButton(text="🏆 Enterprise"), KeyboardButton(text="🤔 Hali bilmayman")],
        ],
        resize_keyboard=True,
    )


# ── Helper ─────────────────────────────────────────────────────────────────

async def notify_admin(text: str) -> None:
    if not ADMIN_CHAT_ID:
        log.warning("ADMIN_CHAT_ID not set — skipping admin notification")
        return
    try:
        await bot.send_message(chat_id=ADMIN_CHAT_ID, text=text)
    except Exception as e:
        log.error("Admin notification failed: %s", e)

def user_tag(msg: Message) -> str:
    u = msg.from_user
    name = f"{u.first_name or ''} {u.last_name or ''}".strip() or "Noma'lum"
    tag  = f"@{u.username}" if u.username else f"ID:{u.id}"
    return f"{name} ({tag})"


# ── /start ─────────────────────────────────────────────────────────────────

@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer(
        "🦷 DentaFlow ga xush kelibsiz!\n\n"
        "O'zbekistondagi eng zamonaviy dental klinika boshqaruv tizimi.\n\n"
        "Quyidagi bo'limlardan birini tanlang:",
        reply_markup=main_kb(),
    )


# ── /myid  (admin setup helper) ────────────────────────────────────────────

@router.message(Command("myid"))
async def cmd_myid(message: Message) -> None:
    await message.answer(
        f"🆔 Sizning chat ID: <code>{message.chat.id}</code>\n\n"
        "Bu raqamni <b>.env</b> faylidagi <code>ADMIN_CHAT_ID=</code> ga qo'shing.",
        parse_mode="HTML",
    )


# ── Cancel (any FSM state) ─────────────────────────────────────────────────

@router.message(F.text == "❌ Bekor qilish")
async def cancel_handler(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer("Bekor qilindi. ❌", reply_markup=main_kb())


# ── 1. Bepul sinov ─────────────────────────────────────────────────────────

@router.message(F.text == "🚀 Bepul sinov boshlash")
async def free_trial(message: Message) -> None:
    await message.answer(
        "Ajoyib! Klinikangizni DentaFlow ga ulash uchun:\n\n"
        "1️⃣ dentaflow.uz/boshlash sahifasiga o'ting\n"
        "2️⃣ Klinika ma'lumotlarini kiriting\n"
        "3️⃣ 14 kun bepul foydalanishni boshlang!\n\n"
        "👉 dentaflow.uz/boshlash",
        reply_markup=main_kb(),
    )


# ── 2. Tariflar ────────────────────────────────────────────────────────────

@router.message(F.text == "📋 Tariflar va narxlar")
async def pricing(message: Message) -> None:
    await message.answer(
        "💎 DentaFlow Tariflar:\n\n"
        "🥈 STARTER — 299,000 so'm/oy\n"
        "- 14 kun bepul sinov\n"
        "- Website + Bemorlar CRM\n"
        "- Telegram bot\n"
        "- 3 xodim\n"
        "- Navbat jadvali\n\n"
        "⭐ PRO — 599,000 so'm/oy\n"
        "- 7 kun bepul sinov\n"
        "- Hammasi + AI PDF\n"
        "- SMS eslatmalar\n"
        "- Cheksiz xodim\n"
        "- Hisobotlar\n\n"
        "🏆 ENTERPRISE — Muzokarali\n"
        "- Hamma PRO imkoniyatlar\n"
        "- Multi-filial\n"
        "- Custom domen\n"
        "- 24/7 qo'llab-quvvatlash\n\n"
        "Batafsil: dentaflow.uz/#tariflar",
        reply_markup=main_kb(),
    )


# ── 3. Demo so'rash (FSM) ──────────────────────────────────────────────────

@router.message(F.text == "🎯 Demo so'rash")
async def demo_start(message: Message, state: FSMContext) -> None:
    await state.set_state(DemoForm.clinic_name)
    await message.answer(
        "📝 Demo so'rovi uchun bir necha savol beramiz.\n\n"
        "🏥 Klinika nomini kiriting:",
        reply_markup=cancel_kb(),
    )

@router.message(DemoForm.clinic_name)
async def demo_clinic_name(message: Message, state: FSMContext) -> None:
    await state.update_data(clinic_name=message.text)
    await state.set_state(DemoForm.phone)
    await message.answer("📞 Telefon raqamingiz:")

@router.message(DemoForm.phone)
async def demo_phone(message: Message, state: FSMContext) -> None:
    await state.update_data(phone=message.text)
    await state.set_state(DemoForm.city)
    await message.answer("📍 Qaysi shaharda joylashgansiz?")

@router.message(DemoForm.city)
async def demo_city(message: Message, state: FSMContext) -> None:
    await state.update_data(city=message.text)
    await state.set_state(DemoForm.plan)
    await message.answer(
        "💎 Qaysi tarif qiziqtiradi?",
        reply_markup=plan_kb(),
    )

@router.message(DemoForm.plan)
async def demo_plan(message: Message, state: FSMContext) -> None:
    await state.update_data(plan=message.text)
    data = await state.get_data()
    await state.clear()

    await notify_admin(
        "🆕 Yangi demo so'rovi!\n\n"
        f"🏥 Klinika: {data['clinic_name']}\n"
        f"📞 Telefon: {data['phone']}\n"
        f"📍 Shahar: {data['city']}\n"
        f"💎 Tarif: {data['plan']}\n\n"
        f"👤 Foydalanuvchi: {user_tag(message)}"
    )

    await message.answer(
        "✅ So'rovingiz qabul qilindi!\n\n"
        "24 soat ichida bog'lanamiz. 🙏",
        reply_markup=main_kb(),
    )


# ── 4. Savol berish (FSM) ──────────────────────────────────────────────────

@router.message(F.text == "❓ Savol berish")
async def question_start(message: Message, state: FSMContext) -> None:
    await state.set_state(QuestionForm.question)
    await message.answer(
        "❓ Savolingizni yozing — 24 soat ichida javob beramiz!",
        reply_markup=cancel_kb(),
    )

@router.message(QuestionForm.question)
async def question_receive(message: Message, state: FSMContext) -> None:
    await state.clear()

    await notify_admin(
        "❓ Yangi savol!\n\n"
        f"👤 Foydalanuvchi: {user_tag(message)}\n\n"
        f"📝 Savol:\n{message.text}"
    )

    await message.answer(
        "✅ Savolingiz qabul qilindi!\n\n"
        "24 soat ichida javob beramiz. Rahmat! 🙏",
        reply_markup=main_kb(),
    )


# ── 5. Bog'lanish ──────────────────────────────────────────────────────────

@router.message(F.text == "📞 Bog'lanish")
async def contact(message: Message) -> None:
    await message.answer(
        "📞 Biz bilan bog'laning:\n\n"
        "✈️ Telegram: @dentaflow_uz\n"
        "📱 Instagram: @dentaflow.uz\n"
        "📞 Telefon: +998 94 305 03 03\n"
        "📧 Email: info@dentaflow.uz\n"
        "🌐 Website: dentaflow.uz\n\n"
        "Ish vaqti: Du-Sh 09:00-18:00",
        reply_markup=main_kb(),
    )


# ── Unknown message fallback ───────────────────────────────────────────────

@router.message()
async def fallback(message: Message, state: FSMContext) -> None:
    current = await state.get_state()
    if current is None:
        await message.answer(
            "Kechirasiz, bu buyruqni tushunmadim. 🤔\n"
            "Pastdagi tugmalardan birini tanlang:",
            reply_markup=main_kb(),
        )


# ── Entry point ────────────────────────────────────────────────────────────

async def main() -> None:
    log.info("DentaFlow support bot starting…")
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())

if __name__ == "__main__":
    asyncio.run(main())
