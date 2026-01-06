const userRequests = new Map();

// konfigurasi
const MAX_REQUESTS = 5;      // max pesan
const WINDOW_MS = 10 * 1000; // dalam 10 detik
const BLOCK_TIME = 60 * 1000; // diblokir 1 menit

export function checkRateLimit(jid) {
  const now = Date.now();

  if (!userRequests.has(jid)) {
    userRequests.set(jid, { count: 1, start: now, blockedUntil: null });
    return { allowed: true };
  }

  const data = userRequests.get(jid);

  // masih diblokir
  if (data.blockedUntil && now < data.blockedUntil) {
    return { allowed: false, blocked: true };
  }

  // reset window
  if (now - data.start > WINDOW_MS) {
    data.count = 1;
    data.start = now;
    data.blockedUntil = null;
    return { allowed: true };
  }

  data.count++;

  // kena limit
  if (data.count > MAX_REQUESTS) {
    data.blockedUntil = now + BLOCK_TIME;
    return { allowed: false, blocked: true };
  }

  return { allowed: true };
}