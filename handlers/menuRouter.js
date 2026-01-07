import fs from "fs";
import path from "path";
import { MENU } from "../menu/menuStructure.js";
import { getState, setState } from "../utils/state.js";

// ===== UTIL =====
function getNodeByPath(path) {
  if (!path) return MENU;

  const parts = path.split(".");
  let node = MENU;

  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];
    if (!node[key]) return null;

    node = node[key];

    if (i < parts.length - 1) {
      if (!node.sub) return null;
      node = node.sub;
    }
  }
  return node;
}

// ===== MAIN ROUTER =====
export async function routeMenu(sock, from, input) {
  const currentState = getState(from);

  const currentNode = getNodeByPath(currentState);
  if (currentNode && !currentNode.sub) {
    setState(from, null);
  }

  // ===== MENU KEMBALI (FIX LOOP & NULL) =====
  if (input === "0") {
    if (!currentState) {
      await showMenu(sock, from, "");
      return;
    }

    const backPath = currentState
      ? currentState.split(".").slice(0, -1).join(".")
      : null;

    setState(from, backPath || null);
    await showMenu(sock, from, backPath);
    return;
  }

  // ===== VALIDASI INPUT =====
  if (!/^\d+$/.test(input)) {
  // ⬇️ JIKA BELUM ADA STATE → SELAMAT DATANG
  if (!getState(from)) {
    await sock.sendMessage(from, {
      text:
        "👋 *Selamat datang di Layanan Informasi*\n" +
        "*Dinas Perikanan Kabupaten Gresik*\n\n" +
        "Silakan pilih menu di bawah ini:"
    });
    await showMenu(sock, from, "");
    return;
  }

  // ⬇️ JIKA SUDAH DI MENU → INPUT SALAH
  await sock.sendMessage(from, {
    text: "❌ Input salah.\nSilakan pilih angka yang tersedia."
  });
  await showMenu(sock, from, getState(from));
  return;
}


  // ===== PATH =====
  const cleanState = getState(from);
  const nextPath = cleanState ? `${cleanState}.${input}` : input;

  const node = getNodeByPath(nextPath);

  // ===== JIKA MENU TIDAK ADA =====
  if (!node) {
    await sock.sendMessage(from, {
      text: "❌ Menu tidak tersedia.\nSilakan pilih angka yang benar."
    });
    await showMenu(sock, from, cleanState);
    return;
  }

  // Update State
  setState(from, nextPath);

  // ===== LEAF =====
  if (!node.sub) {
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

    if (node.content) {
      await sock.sendMessage(from, { text: node.content });
    }

    if (node.contact) {
      await sock.sendMessage(from, {
        text:
          `📞 *Kontak Layanan*\n\n` +
          node.contact.map(c => `${c.name}: ${c.phone}`).join("\n")
      });
    }

    setState(from, null);
    await sock.sendMessage(from, {
      text: "✅ Selesai.\n\nKetik *menu* untuk kembali ke awal."
    });
    return;
  }

  // ===== SUB MENU =====
  await showMenu(sock, from, nextPath);
}

// ===== TAMPIL MENU =====
async function showMenu(sock, from, path) {
  const node = getNodeByPath(path);
  if (!node) return;

  let menuItems;

  if (node.sub) {
    menuItems = node.sub;
  } else {
    menuItems = node;
  }

  let text = "📋 *Silakan pilih menu:*\n\n";

  for (const key in menuItems) {
    const item = menuItems[key];
    if (!item?.name) continue;
    text += `${key}. ${item.name}\n`;
  }

  text += "\n0. 🔙 Kembali\nmenu. 🏠 Menu Utama";
  await sock.sendMessage(from, { text });
}
