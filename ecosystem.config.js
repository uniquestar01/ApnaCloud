module.exports = {
  apps: [
    {
      name: "apnacloud-backend",
      cwd: "./backend",
      script: "npm.cmd",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "apnacloud-frontend",
      cwd: "./frontend",
      script: "npm.cmd",
      args: "run dev -- --host",
      env: {
        NODE_ENV: "development",
        VITE_PORT: 5173
      }
    }
  ]
};
