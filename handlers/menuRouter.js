import fs from "fs";
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

  // ===== KEMBALI =====
  if (input === "0") {
    if (!currentState) {
      await showMenu(sock, from, "");
      return;
    }

    const backPath = currentState.split(".").slice(0, -1).join(".");
    setState(from, backPath || null);
    await showMenu(sock, from, backPath);
    return;
  }

  // ===== VALIDASI INPUT =====
  if (!/^\d+$/.test(input)) {
    await showMenu(sock, from, currentState);
    return;
  }

  const node = getNodeByPath(nextPath);

  if (!node) {
    await sock.sendMessage(from, {
      text: "❌ Menu tidak tersedia.\nSilakan pilih angka sesuai menu."
    });
    return;
  }

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
          fileName: node.file.path.split("/").pop()
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

    await sock.sendMessage(from, {
      text: "0. 🔙 Kembali\nmenu. 🏠 Menu Utama"
    });
    return;
  }

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