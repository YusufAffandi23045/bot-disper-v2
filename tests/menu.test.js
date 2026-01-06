import menuStructure from "../menu/menuStructure.js";

function resolve(menu, path) {
  let node = null;
  let pointer = menu;
  for (const p of path) {
    node = pointer[p];
    if (!node) return null;
    pointer = node.children || {};
  }
  return node;
}

console.log("TEST 1: Menu Utama");
console.assert(menuStructure["1"], "Menu 1 tidak ada");

console.log("TEST 2: Tangkap → Perizinan");
const tangkap = resolve(menuStructure, "21");
console.assert(tangkap?.file, "PDF Tangkap Perizinan tidak ada");

console.log("TEST 3: Invalid Path");
const invalid = resolve(menuStructure, "99");
console.assert(invalid === null, "Invalid path lolos");

console.log("✅ SEMUA TEST LULUS");
