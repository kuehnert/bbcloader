module.exports = (shipit) => {
  require("shipit-deploy")(shipit);

  shipit.initConfig({
    default: {
      dirToCopy: "backend",
      servers: "pi@192.168.168.4",
      repositoryUrl: "https://github.com/kuehnert/bbcloader.git",
      keepReleases: 5,
      deleteOnRollback: false,
    },
    production: {
      deployTo: "/home/pi/sites/bbcloader-api",
      branch: "master",
    },
  });

  shipit.on("deployed", () => {
    shipit.start("build");
    // shipit.start("reload");
  });

  shipit.blTask("build", async () => {
    await shipit.copyToRemote(
      `.env.${shipit.config.branch}`,
      `${shipit.releasePath}/.env`
    );
    await shipit.remote(`cd ${shipit.releasePath} && npm install`);
    await shipit.remote(`cd ${shipit.releasePath} && npm run build`);
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
