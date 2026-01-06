import { routeMenu } from "./menuRouter.js";
import { checkRateLimit } from "../utils/rateLimit.js";
import { logActivity } from "../utils/logger.js";
import { isWorkingHours, outsideWorkingHoursMessage } from "../utils/time.js";
import { resetIdleTimer } from "../utils/idle.js";
import { countOutsideMessage } from "../utils/outsideCounter.js";
import { resetState, getState } from "../utils/state.js"; // <--- TAMBAH getState

const ADMIN_JID = "6281334580496@s.whatsapp.net";

export async function handleMessage(sock, msg, BOT_CONFIG) {
  if (!msg.message || msg.key.fromMe) return;

  const from = msg.key.remoteJid;
  resetIdleTimer(sock, from, BOT_CONFIG);

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    "";

  const input = text.trim();

  logActivity(from, input);

  const limit = checkRateLimit(from);
  if (!limit.allowed) {
    await sock.sendMessage(from, {
      text: "⚠️ Terlalu banyak pesan.\nSilakan tunggu sebentar."
    });
    return;
  }

  // reset menu
  if (input.toLowerCase().startsWith("menu")) {
    resetState(from);
    await routeMenu(sock, from, "");
    return;
  }

  // luar jam kerja
  if (!isWorkingHours()) {
    await countOutsideMessage(sock, from, ADMIN_JID);

    // Ambil posisi menu user saat ini
    const currentState = getState(from);

    // Izinkan jika input "1" ATAU user sudah berada di dalam menu 1 (Sekretariat)
    const isAllowed = input === "1" || (currentState && currentState.startsWith("1"));

    if (!isAllowed) {
      await sock.sendMessage(from, {
        text: outsideWorkingHoursMessage() + "\n\nKetik *1* untuk Sekretariat."
      });
      return;
    }
  }

  await routeMenu(sock, from, input);
}