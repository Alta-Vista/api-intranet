module.exports = {
  apps: [
    {
      name: 'API-V2',
      script: './dist/src/main.js',
      exec_mode: 'cluster',
    },
  ],
};
