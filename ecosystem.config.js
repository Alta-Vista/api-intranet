module.exports = {
  apps: [
    {
      name: 'API-V2',
      script: './dist/main.js',
      exec_mode: 'cluster',
    },
  ],
};
