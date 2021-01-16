// based on https://github.com/nanogiants/cordova-plugin-hot-reload
// thanks to https://github.com/nanogiants

const address = require('address');
const defaultGateway = require('default-gateway');
const fs = require('fs');
const os = require('os');
const path = require('path');
// const { config } = require('process');
const xmlToJs = require('xml2js');

function configXmlPath(projectRoot) {
  return path.join(projectRoot, 'config.xml');
}

async function configXmlReadJson(configPath) {
  const cordovaConfig = fs.readFileSync(configPath, 'utf-8');
  return await xmlToJs.parseStringPromise(cordovaConfig);
}

function configXmlWriteJson(configPath, json) {
  const builder = new xmlToJs.Builder();
  const xml = builder.buildObject(json);
  fs.writeFileSync(configPath, xml);
}

function configRemoteContent(json, url) {
  // set app content to remote url
  json.widget.content[0].$.src = url;

  json.widget['allow-navigation'] = json.widget['allow-navigation'] || [];
  if(!json.widget['allow-navigation'].find((item) => item.$.href === `${url}/*`)) {
    json.widget['allow-navigation'].push({
      $: {
        href: `${url}/*`,
      },
    });
  }

  return json;
}

function configLocalContent(json) {
  // set app content to local
  json.widget.content[0].$.src = 'index.html';

  // remove remote content allow-navigation settings, if any
  if (json.widget['allow-navigation']) {
    json.widget['allow-navigation'] = json.widget['allow-navigation'].filter(
      // there must not be any other unencrypted allow-navigation items
      (item) => !item.$.href.startsWith('http://')
    );
    if (json.widget['allow-navigation'].length === 0) {
      delete json.widget['allow-navigation'];
    }
  }

  return json;
}

module.exports = async function (context) {
  const port = process.env.PORT;
  if(!port) {
    throw Error('environment variable PORT must be set.');
  }

  const contentMode = process.env.CONTENT_MODE;
  if(!port || !contentMode) {
    throw Error('environment variable CONTENT_MODE must be set.');
  }

  const { projectRoot } = context.opts;
  if(!projectRoot) {
    throw Error('cannot get project root');
  }

  // update config.xml --------------------------------------------------------

  const configPath = configXmlPath(projectRoot);
  const json = await configXmlReadJson(configPath);

  if(contentMode === 'local') {
    console.log('HOOK: switch-local-remote-content: local content');

    configLocalContent(json);
  }
  else if(contentMode === 'remote') {
    // TODO: clean?
    const result = defaultGateway.v4.sync();
    const ip = address.ip(result && result.interface);
    const url = `http://${ip}:${port}`;

    console.log(`HOOK: switch-local-remote-content: remote content ${url}`);

    configRemoteContent(json, url);
  }
  else {
    throw Error('invalid content mode');
  }

  configXmlWriteJson(configPath, json);


  // manage symlinks ----------------------------------------------------------

  const cordovaFiles = ['cordova.js', 'cordova_plugins.js', 'plugins'];

  if(contentMode === 'local') {
    cordovaFiles.forEach((filename) => {
      const symlinkDestPath = path.join(projectRoot, 'www', filename);

      if (fs.existsSync(symlinkDestPath)) {
        fs.unlinkSync(symlinkDestPath);
      }
    });
  }
  else if(contentMode === 'remote') {
    const symlinkType = os.platform() === 'win32' ? 'junction' : 'dir';
    const platform = context.opts.platforms[0];

    cordovaFiles.forEach((filename) => {
      const symlinkSrcPath = path.join(
          projectRoot, 'platforms', platform, 'platform_www', filename);

      if (fs.existsSync(symlinkSrcPath)) {
        const symlinkDestPath = path.join(projectRoot, 'www', filename);
        if (fs.existsSync(symlinkDestPath)) {
          fs.unlinkSync(symlinkDestPath);
        }
        fs.symlinkSync(symlinkSrcPath, symlinkDestPath, symlinkType);
      }
    });
  }
};
