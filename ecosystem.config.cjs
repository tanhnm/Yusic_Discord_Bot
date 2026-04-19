module.exports = {
  apps: [
    {
      name: 'yusic-bot',
      script: 'src/index.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'lavalink',
      script: 'java',
      args: ['-jar', 'Lavalink.jar'],
      cwd: './lavalink',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G'
    }
  ]
};
