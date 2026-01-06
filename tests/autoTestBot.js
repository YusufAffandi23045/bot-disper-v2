// tests/autoTestBot.js
import { routeMenu } from "../handlers/menuRouter.js";
import { resetState } from "../utils/state.js";

const mockSock = {
  sendMessage: async (to, payload) => {
    console.log("\n--- BOT OUTPUT ---");
    console.log(payload);
  }
};

const USER = "test@s.whatsapp.net";

async function run() {
  console.log("🧪 START BOT TEST\n");

  resetState(USER);

  await routeMenu(mockSock, USER, "menu");
  await routeMenu(mockSock, USER, "1");
  await routeMenu(mockSock, USER, "1");
  await routeMenu(mockSock, USER, "0");
  await routeMenu(mockSock, USER, "2");
  await routeMenu(mockSock, USER, "menu");

  console.log("\n✅ TEST SELESAI");
}

run();
