// based on https://github.com/nanogiants/cordova-plugin-hot-reload
// thanks to https://github.com/nanogiants

const address = require('address');
const defaultGateway = require('default-gateway');
const fs = require('fs');
const path = require('path');
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
  const port = 9000;

  const contentMode = process.env.CONTENT_MODE;
  if(!port || !contentMode) {
    throw Error('environment variable CONTENT_MODE must be set.');
  }

  const { projectRoot } = context.opts;
  if(!projectRoot) {
    throw Error('cannot get project root');
  }

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
};
