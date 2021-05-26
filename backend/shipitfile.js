module.exports = shipit => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      dirToCopy: 'backend',
      repositoryUrl: 'https://github.com/kuehnert/bbcloader.git',
      keepReleases: 5,
      shared: {
        overwrite: true,
        dirs: ['node_modules', 'data'],
      },
      deleteOnRollback: false,
    },
    production: {
      servers: 'mk@bbc.kuehnert.it',
      deployTo: '/home/mk/sites/bbcloader-api',
      branch: 'master',
    },
  });

  shipit.on('updated', () => {
    shipit.start('npm-install', 'copy-config');
  });

  shipit.on('published', () => {
    shipit.start('reload');
  });

  shipit.on('rollback', () => {
    shipit.start('npm-install', 'copy-config');
  });

  shipit.blTask('copy-config', async () => {
    await shipit.copyToRemote(`.env.production`, `${shipit.releasePath}/.env`);
    await shipit.copyToRemote('bin', `${shipit.releasePath}/bin`);
  });

  shipit.blTask('npm-install', async () => {
    // await shipit.remote(`cd ${shipit.releasePath} && npm install --production`);
    await shipit.remote(`cd ${shipit.releasePath} && npm install`);
    // await shipit.remote(`cd ${shipit.releasePath} && npm run build`);
  });

  shipit.blTask('reload', async () => {
    await shipit.remote(`sudo ${shipit.releasePath}/bin/restart_bbcloader.sh`);
  });
};

/*
  /lib/systemd/system
  sudo systemctl daemon-reload
  sudo systemctl enable linkshortener-staging.service
  sudo systemctl status linkshortener-staging
*/

// source: https://www.digitalocean.com/community/tutorials/how-to-automate-your-node-js-production-deployments-with-shipit-on-centos-7
