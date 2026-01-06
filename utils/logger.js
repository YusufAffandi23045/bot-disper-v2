import fs from "fs";
import path from "path";

const LOG_DIR = "./logs";
const LOG_FILE = path.join(LOG_DIR, "activity.log");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

export function logActivity(from, message) {
  const time = new Date().toISOString();
  const log = `[${time}] ${from} | ${message}\n`;
  fs.appendFileSync(LOG_FILE, log);
}