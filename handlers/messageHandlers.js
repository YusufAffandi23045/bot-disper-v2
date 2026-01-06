import { routeMenu } from "./menuRouter.js";
import { checkRateLimit } from "../utils/rateLimit.js";
import { logActivity } from "../utils/logger.js";
import { isWorkingHours, outsideWorkingHoursMessage } from "../utils/time.js";
import { resetIdleTimer } from "../utils/idle.js";
import { countOutsideMessage } from "../utils/outsideCounter.js";
import { resetState } from "../utils/state.js";

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

    if (input !== "1") {
      await sock.sendMessage(from, {
        text: outsideWorkingHoursMessage() + "\n\nKetik *1* untuk Sekretariat."
      });
      return;
    }
  }

  await routeMenu(sock, from, input);
}