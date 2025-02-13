module.exports = {
  apps: [
    {
      name: 'server', 
      script: 'src/server.js', 
      instances: 1,
      autorestart: true, 
      watch: true,
      max_memory_restart: '500M', 
    },
    {
      name: 'email_worker', 
      script: 'src/utils/workers/email.js', 
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '400M',
    },
    {
      name: 'sms_worker', 
      script: 'src/utils/workers/sms.js', 
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '400M',
    },
  ],
};
