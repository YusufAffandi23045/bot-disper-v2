const idleTimers = new Map();

const IDLE_MESSAGE =
`🙏 Terima kasih telah menghubungi
*Dinas Perikanan Kabupaten Gresik.*

Jika masih membutuhkan bantuan,
silakan kirim pesan kembali.

Selamat melanjutkan aktivitas 🌿`;

export function resetIdleTimer(sock, jid, BOT_CONFIG) {
  if (idleTimers.has(jid)) {
    clearTimeout(idleTimers.get(jid));
  }

  const timeout = setTimeout(async () => {
    try {
      await sock.sendMessage(jid, { text: IDLE_MESSAGE });
    } catch (err) {
      console.error("Gagal kirim pesan idle:", err);
    }
    idleTimers.delete(jid);
  }, BOT_CONFIG.IDLE_TIMEOUT_MINUTES * 60 * 1000);

  idleTimers.set(jid, timeout);
}