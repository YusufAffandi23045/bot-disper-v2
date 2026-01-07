module.exports = {
  apps: [
    {
      name: "bot-disper-v2",
      script: "index.js",
      watch: false,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
