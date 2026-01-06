import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";

import { handleMessage } from "./handlers/messageHandlers.js";

export const BOT_CONFIG = {
  BOT_NAME: "DISPER BOT",
  IDLE_TIMEOUT_MINUTES: 5
};

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["DISPER BOT", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) qrcode.generate(qr, { small: true });

    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode ||
        lastDisconnect?.error?.statusCode;

      if (reason !== DisconnectReason.loggedOut) {
        startBot();
      } else {
        process.exit(1);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;
    await handleMessage(sock, msg, BOT_CONFIG);
  });
}

startBot();
