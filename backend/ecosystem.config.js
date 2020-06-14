module.exports = {
      apps: [
        {
          name: 'bbcloader',
          script: 'cd /home/mk/sites/bbcloader-api/releases/20200611100734 && node src/app.js',
          watch: true,
          autorestart: true,
          restart_delay: 5000,
          env: {
            NODE_ENV: 'development'
          },
          env_production: {
            NODE_ENV: 'production'
          }
        }
      ]
    };