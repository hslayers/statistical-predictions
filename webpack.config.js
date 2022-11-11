const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'statistics',

  exposes: {
    './HsStatisticsPanelComponent': './src/lib/statistics-panel.component.ts',
  },

  shared: {
    "@angular/core": {
      singleton: true,
      strictVersion: false,
      requiredVersion: "auto",
    },
    "@angular/common": {
      singleton: true,
      strictVersion: false,
      requiredVersion: "auto",
    },
    "@angular/forms": {
      singleton: true,
      strictVersion: false,
      requiredVersion: "auto",
    },
    "@angular/common/http": {
      singleton: true,
      strictVersion: false,
      requiredVersion: "auto",
    },
    "@angular/router": {
      singleton: true,
      strictVersion: false,
      requiredVersion: "auto",
    },
    "@ngx-translate/core": { singleton: true, strictVersion: false },
    "@angular/localize/init": {
      singleton: true,
      eager: true,
    },
    'ol': {singleton: true, requiredVersion: '^7.1.0'},
    'ol-ext': {singleton: true, requiredVersion: '^4.0.3'},
    'ol/layer': {
      singleton: true,
    },
    'ol/source': {
      singleton: true,
    },
    'hslayers-ng': {
      singleton: true,
      strictVersion: true,
      requiredVersion: '^10.0.0',
      version: '10.0.0'
    },
  }

})