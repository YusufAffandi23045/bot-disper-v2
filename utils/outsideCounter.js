const counter = new Map();
const THRESHOLD = 5; // 5 pesan
const INTERVAL_MINUTES = 30;

export async function countOutsideMessage(sock, from, adminJid) {
  const now = Date.now();
  const data = counter.get(from) || { count: 0, last: now };

  if (now - data.last > INTERVAL_MINUTES * 60000) {
    data.count = 0;
    data.last = now;
  }

  data.count++;
  counter.set(from, data);

  if (data.count === THRESHOLD) {
    await sock.sendMessage(adminJid, {
      text:
`🔔 *Notifikasi Bot Disper*

Pengguna ${from}
mengirim *${THRESHOLD}+ pesan*
di luar jam layanan.

Perlu ditindaklanjuti.`
    });
  }
}
