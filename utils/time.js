import fs from "fs";
import path from "path";

const HOLIDAY_FILE = path.resolve("./utils/holidays.json");

let holidayDates = [];

// ===== LOAD LIBUR NASIONAL & CUTI BERSAMA =====
function loadHolidays() {
  try {
    const raw = fs.readFileSync(HOLIDAY_FILE, "utf-8");
    const json = JSON.parse(raw);

    holidayDates = json.hari_libur_dan_cuti
      .filter(item =>
        item.tipe === "Libur Nasional" ||
        item.tipe === "Cuti Bersama"
      )
      .map(item => item.tanggal);

    console.log(
      `📅 Data libur ${json.tahun} berhasil dimuat (${holidayDates.length} hari)`
    );

  } catch (err) {
    console.error("❌ Gagal membaca holidays.json:", err.message);
    holidayDates = [];
  }
}

loadHolidays();

// ===== CEK JAM KERJA (MODE OFFLINE) =====
export function isWorkingHours() {
  const now = new Date();
  // Tambah offset 7 jam untuk WIB
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wib = new Date(utc + (3600000 * 7));

  const day = wib.getDay(); // 0-6
  const hour = wib.getHours();
  const today = wib.toISOString().split("T")[0]; // YYYY-MM-DD

  // ===== LIBUR NASIONAL / CUTI BERSAMA =====
  if (holidayDates.includes(today)) return false;

  // ===== SENIN - JUMAT =====
  if (day >= 1 && day <= 5) {
    return hour >= 8 && hour < 16;
  }

  // ===== SABTU & MINGGU LIBUR =====
  return false;
}

export function outsideWorkingHoursMessage() {
  return `🙏 Terima kasih telah menghubungi
*Dinas Perikanan Kabupaten Gresik.*

Saat ini layanan berada di luar
jam operasional.

🕘 *Jam Layanan:*
Senin – Jumat
08.00 – 16.00 WIB

Silakan menghubungi kembali
pada jam kerja.
Terima kasih 🌿`;
}