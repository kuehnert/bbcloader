module.exports = (shipit) => {
  require("shipit-deploy")(shipit);
  require("shipit-shared")(shipit);
  const appName = "bbcloader";

  shipit.initConfig({
    default: {
      dirToCopy: "backend",
      repositoryUrl: "https://github.com/kuehnert/bbcloader.git",
      keepReleases: 5,
      shared: {
        overwrite: true,
        dirs: ["node_modules", "data"],
      },
      deleteOnRollback: false,
    },
    production: {
      servers: "mk@192.168.168.4",
      deployTo: "/home/mk/sites/bbcloader-api",
      branch: "master",
    },
  });

  const path = require("path");
  const ecosystemFilePath = path.join(
    shipit.config.deployTo,
    "shared",
    "ecosystem.config.js"
  );

  shipit.on("updated", () => {
    shipit.start("npm-install", "copy-config");
  });

  // shipit.on("deployed", () => {
  //   shipit.start("build");
  //   // shipit.start("reload");
  // });

  shipit.on("published", () => {
    shipit.start("pm2-server");
  });

  shipit.on('rollback', () => {
    shipit.start('npm-install', 'copy-config');
  });

  shipit.blTask("copy-config", async () => {
    const fs = require("fs");
    const ecosystem = `module.exports = {
      apps: [
        {
          name: '${appName}',
          script: '${shipit.releasePath}/src/app.js',
          watch: true,
          autorestart: true,
          restart_delay: 1000,
          env: {
            NODE_ENV: 'development'
          },
          env_production: {
            NODE_ENV: 'production'
          }
        }
      ]
    };`;
    fs.writeFileSync("ecosystem.config.js", ecosystem);

    await shipit.copyToRemote("ecosystem.config.js", ecosystemFilePath);

    await shipit.copyToRemote(
      `.env.${shipit.config.branch}`,
      `${shipit.releasePath}/.env`
    );
  });

  shipit.blTask("npm-install", async () => {
    await shipit.remote(`cd ${shipit.releasePath} && npm install --production`);
    // await shipit.remote(`cd ${shipit.releasePath} && npm run build`);
  });

  shipit.blTask("pm2-server", async () => {
    await shipit.remote(`pm2 delete -s ${appName} || :`);
    await shipit.remote(
      `pm2 start ${ecosystemFilePath} --env production --watch true`
    );
  });

  // shipit.task("reload", async () => {
  //   await shipit.remote("sudo /home/pi/bin/restart_linkshortener");
  // });
};

/*
  /lib/systemd/system
  sudo systemctl daemon-reload
  sudo systemctl enable linkshortener-staging.service
  sudo systemctl status linkshortener-staging
*/

// source: https://www.digitalocean.com/community/tutorials/how-to-automate-your-node-js-production-deployments-with-shipit-on-centos-7
