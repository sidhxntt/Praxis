module.exports = {
  apps: [
    {
      name: 'server', 
      script: 'dist/server.js', 
      instances: 1,
      autorestart: true, 
      watch: true,
      max_memory_restart: '500M', 
    },
    {
      name: 'email_worker', 
      script: 'dist/utils/workers/email.js', 
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '400M',
    },
    {
      name: 'sms_worker', 
      script: 'dist/utils/workers/sms.js', 
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '400M',
    },
  ],
};
