import fs from "fs";
import path from "path";
import { MENU } from "../menu/menuStructure.js";
import { getState, setState } from "../utils/state.js";

// ===== UTIL =====
function getNodeByPath(path) {
  if (!path) return MENU;

  const parts = path.split(".");
  let node = MENU;

  for (const p of parts) {
    if (!node[p]) return null;
    node = node[p].sub || node[p];
  }
  return node;
}

// ===== MAIN ROUTER =====
export async function routeMenu(sock, from, input) {
  const currentState = getState(from);
  const nextPath = currentState ? `${currentState}.${input}` : input;

  // ===== KEMBALI (0) =====
  if (input === "0") {
    if (!currentState) {
      await showMenu(sock, from, "");
      return;
    }
    // Mundur satu langkah
    const backPath = currentState.split(".").slice(0, -1).join(".");
    // Jika backPath kosong, berarti kembali ke menu utama (null)
    setState(from, backPath || null);
    await showMenu(sock, from, backPath);
    return;
  }

  // ===== VALIDASI INPUT (FIX #2: RESET JIKA SALAH) =====
  // Jika input bukan angka, jangan biarkan user stuck di state lama.
  // Reset ke awal biar bersih.
  if (!/^\d+$/.test(input)) {
    setState(from, null); // <--- RESET STATE
    await sock.sendMessage(from, { 
        text: "❌ Input salah. Kembali ke menu utama." 
    });
    await showMenu(sock, from, "");
    return;
  }

  const node = getNodeByPath(nextPath);

  // ===== JIKA MENU TIDAK ADA =====
  if (!node) {
    await sock.sendMessage(from, {
      text: "❌ Menu tidak tersedia.\nSilakan pilih angka yang benar."
    });
    // Jangan reset state di sini, beri kesempatan user mencoba angka lain
    // tapi tetap tampilkan menu saat ini sebagai panduan
    await showMenu(sock, from, currentState); 
    return;
  }

  // Update State ke posisi baru
  setState(from, nextPath);

  // ===== LEAF (UJUNG MENU) (FIX #3: RESET SETELAH SELESAI) =====
  if (!node.sub) {
    // 1. Kirim File PDF (jika ada)
    if (node.file?.type === "pdf") {
      if (!fs.existsSync(node.file.path)) {
        await sock.sendMessage(from, {
          text: "📄 Dokumen belum tersedia.\nSilakan hubungi sekretariat."
        });
      } else {
        await sock.sendMessage(from, {
          document: { url: node.file.path },
          mimetype: "application/pdf",
          fileName: path.basename(node.file.path),
        });
      }
    }

    // 2. Kirim Konten Teks (jika ada)
    if (node.content) {
      await sock.sendMessage(from, { text: node.content });
    }

    // 3. Kirim Kontak (jika ada)
    if (node.contact) {
      await sock.sendMessage(from, {
        text:
          `📞 *Kontak Layanan*\n\n` +
          node.contact.map(c => `${c.name}: ${c.phone}`).join("\n")
      });
    }

    // 🔥 VITAL FIX: RESET STATE SETELAH LEAF 🔥
    // User sudah selesai di menu ini. Jangan biarkan state menggantung.
    setState(from, null); 

    await sock.sendMessage(from, {
      text: "✅ Selesai.\n\nKetik *menu* untuk kembali ke awal."
    });
    return;
  }

  // Jika bukan leaf (masih ada sub-menu), tampilkan listnya
  await showMenu(sock, from, nextPath);
}

// ===== TAMPIL MENU =====
async function showMenu(sock, from, path) {
  const node = getNodeByPath(path);
  if (!node) return;

  let text = "📋 *Silakan pilih menu:*\n\n";
  for (const key in node) {
    text += `${key}. ${node[key].name}\n`;
  }

  text += "\n0. 🔙 Kembali\nmenu. 🏠 Menu Utama";
  await sock.sendMessage(from, { text });
}