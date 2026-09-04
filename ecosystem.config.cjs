module.exports = {
  apps: [
    {
      name: 'mebel-shop',
      port: '8099',
      exec_mode: 'cluster',
      instances: 1,
      script: './.output/server/index.mjs',
    }
  ]
}
