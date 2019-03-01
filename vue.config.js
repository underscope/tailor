'use strict';

const path = require('path');
const serverPort = require('./config/server').port;
const map = require('lodash/map');

const { NODE_ENV, STORAGE_PATH } = process.env;
const imagesPath = 'assets/img';
const isProduction = NODE_ENV === 'production';
const serverUrl = `http://127.0.0.1:${serverPort}`;

const aliases = {
  '@': path.resolve(__dirname, './client'),
  client: '@',
  assets: '@/assets',
  components: '@/components',
  'tce-core': '@/components/common/tce-core',
  EventBus: '@/EventBus',
  utils: '@/utils',
  shared: path.join(__dirname, 'config/shared'),
  tce: path.join(__dirname, 'content-elements')
};

const devServer = {
  headers: {
    'X-Powered-By': 'Webpack DevSever'
  },
  proxy: {
    '/api': { target: serverUrl },
    ...(STORAGE_PATH ? { '/repository': { target: serverUrl } } : {})
  },
  // Override using: `npm run dev:server -- --port <number>`
  port: 8080,
  // hotEntries: ['app']
};

const getAppConfig = () => ({
  title: 'Tailor',
  favicon: 'default-favicon.ico',
  logo: {
    compact: 'default-logo-compact.svg',
    full: 'default-logo-full.svg'
  }
});

const getStyleConfig = () => ({
  brandColor: '#0D47A0',
  altBrandColor: '#5C6BC0'
});

const toScssVariable = (value, name) => `$${name}: ${value};`;
const style = getStyleConfig();
const constants = getAppConfig();

module.exports = {
  pages: {
    app: {
      filename: 'index.html',
      entry: 'client/main.js'
    }
  },
  outputDir: 'dist',
  productionSourceMap: false,

  css: {
    loaderOptions: {
      sass: { data: map(style, toScssVariable).join('\n') }
    }
  },

  chainWebpack(config) {
    config.resolve.alias.merge(aliases);

    config.module.rule('bootstrap')
      .test(/bootstrap-sass[/\\]assets[/\\]javascripts[/\\]/)
      .post()
      .use('imports-loader')
      .loader(require.resolve('imports-loader'))
      .options({ jQuery: 'jquery' });

    config.module.rule('val')
      .test(/\.load\.js$/)
      .post()
      .use('val-loader')
      .loader(require.resolve('val-loader'));

    config
      .plugin('define')
      .tap(([vars]) => [{
        ...vars,
        BRAND_CONFIG: {
          TITLE: JSON.stringify(constants.title),
          FAVICON: JSON.stringify(path.join(imagesPath, constants.favicon)),
          LOGO_COMPACT: JSON.stringify(path.join(imagesPath, constants.logo.compact)),
          LOGO_FULL: JSON.stringify(path.join(imagesPath, constants.logo.full))
        }
      }]);

    config
      .plugin('dotenv')
      .use(require.resolve('dotenv-webpack'));

    if (!isProduction) return;
    config
      .plugin('minimize')
      .tap(([options]) => {
        options.terserOptions.keep_fnames = true;
        return [options];
      });
  },
  devServer
};
