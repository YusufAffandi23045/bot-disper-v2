npm install -g pm2

pm2 -v

Masuk ke Folder Bot

pm2 start index.js --name bot-disper

cek status
pm2 status

SETIAP KALI ADA UPDATE DARI GITHUB
cd path\ke\bot-disper-v2
git pull origin main
pm2 restart bot-disper

BOT AUTO JALAN SAAT KOMPUTER NYALA
pm2 startup
pm2 save

| Aksi        | Perintah                 |
| ----------- | ------------------------ |
| Status      | `pm2 status`             |
| Restart bot | `pm2 restart bot-disper` |
| Stop bot    | `pm2 stop bot-disper`    |
| Start lagi  | `pm2 start bot-disper`   |
| Log         | `pm2 logs bot-disper`    |
