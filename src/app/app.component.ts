import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, lastValueFrom} from 'rxjs';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {OSM, Vector as VectorSource, XYZ} from 'ol/source';
import {Tile} from 'ol/layer';

import {
  HsConfig,
  HsDialogContainerService,
  HsLayerManagerComponent,
  HsLayoutService,
  HsQueryComponent,
  HsQueryPopupComponent,
  HsQueryPopupService,
  HsSearchToolbarComponent,
  HsStylerComponent,
  HsToolbarPanelContainerService,
} from 'hslayers-ng';
import {
  HsStatisticsService,
  StatisticsServiceParams,
} from '../lib/statistics.service';
import {defaultStyleSld} from './default-style';
import { HsStatisticsHelpDialogComponent } from './help-dialog/help-dialog.component';

@Component({
  selector: 'hslayers-app',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class HslayersAppComponent {
  app = 'default';
  statisticsAppRef: StatisticsServiceParams;
  constructor(
    public HsConfig: HsConfig,
    private httpClient: HttpClient,
    hsLayoutService: HsLayoutService,
    hsQueryPopupService: HsQueryPopupService,
    hsToolbarPanelContainerService: HsToolbarPanelContainerService,
    public hsStatisticsService: HsStatisticsService,
    private hsDialogContainerService: HsDialogContainerService
  ) {
    const vidzemeMuniSrc = new VectorSource({
      loader: (extent, projection) => {
        const url = './assets/vidzeme.json';
        this.loadFeatureToSrc(url, vidzemeMuniSrc);
      },
    });
    const vidzemeMuni = new VectorLayer({
      visible: false,
      properties: {
        title: 'Vidzeme statistical region municipalities',
        synchronize: false,
        cluster: false,
        inlineLegend: true,
        popUp: {
          attributes: ['LABEL', 'value'],
        },
        editor: {
          editable: true,
          defaultAttributes: {
            name: 'New polygon',
            description: 'none',
          },
        },
        sld: defaultStyleSld,
        path: 'User generated',
      },
      source: vidzemeMuniSrc,
    });
    const latvianMuniSrc = new VectorSource({
      loader: (extent, projection) => {
        const url = './assets/administrativas_teritorijas_2021_2.json';
        this.loadFeatureToSrc(url, latvianMuniSrc);
      },
    });
    const latvianMuni = new VectorLayer({
      visible: false,
      properties: {
        title: 'Latvian municipalities',
        synchronize: false,
        cluster: false,
        inlineLegend: true,
        popUp: {
          attributes: ['LABEL', 'NOSAUKUMS', 'value'],
        },
        editor: {
          editable: true,
          defaultAttributes: {
            name: 'New polygon',
            description: 'none',
          },
        },
        sld: defaultStyleSld,
        path: 'User generated',
      },
      source: latvianMuniSrc,
    });

    const nuts2Src = new VectorSource({
      loader: (extent, projection) => {
        const url = './assets/nutsrg_2.json';
        this.loadFeatureToSrc(url, nuts2Src);
      },
    });
    const nuts2 = new VectorLayer({
      visible: false,
      properties: {
        title: 'Nuts2 regions',
        synchronize: false,
        cluster: false,
        inlineLegend: true,
        popUp: {
          attributes: ['na', 'value', 'id'],
        },
        editor: {
          editable: true,
          defaultAttributes: {
            na: 'New polygon',
          },
        },
        sld: defaultStyleSld,
        path: 'User generated',
      },
      source: nuts2Src,
    });

    const nuts3Src = new VectorSource({
      loader: (extent, projection) => {
        const url = './assets/nutsrg_3.json';
        this.loadFeatureToSrc(url, nuts3Src);
      },
    });

    const nuts3 = new VectorLayer({
      visible: false,
      properties: {
        title: 'Nuts3 regions',
        synchronize: false,
        cluster: false,
        inlineLegend: true,
        popUp: {
          attributes: ['na', 'value', 'id'],
        },
        editor: {
          editable: true,
          defaultAttributes: {
            na: 'New polygon',
          },
        },
        sld: defaultStyleSld,
        path: 'User generated',
      },
      source: nuts3Src,
    });

    const nuts1Src = new VectorSource({
      loader: (extent, projection) => {
        const url = './assets/nutsrg_1.json';
        this.loadFeatureToSrc(url, nuts1Src);
      },
    });

    const nuts1 = new VectorLayer({
      visible: false,
      properties: {
        title: 'Nuts1 regions',
        synchronize: false,
        cluster: false,
        inlineLegend: true,
        popUp: {
          attributes: ['na', 'value', 'id'],
        },
        editor: {
          editable: true,
          defaultAttributes: {
            na: 'New polygon',
          },
        },
        sld: defaultStyleSld,
        path: 'User generated',
      },
      source: nuts1Src,
    });

    const nuts0Src = new VectorSource({
      loader: (extent, projection) => {
        const url = './assets/nutsrg_0.json';
        this.loadFeatureToSrc(url, nuts0Src);
      },
    });

    const nuts0 = new VectorLayer({
      visible: false,
      properties: {
        title: 'Nuts0 regions (countries)',
        synchronize: false,
        cluster: false,
        inlineLegend: true,
        popUp: {
          attributes: ['na', 'value', 'id'],
        },
        editor: {
          editable: true,
          defaultAttributes: {
            na: 'New polygon',
          },
        },
        sld: defaultStyleSld,
        path: 'User generated',
      },
      source: nuts0Src,
    });

    this.HsConfig.update(
      {
        datasources: [
          {
            title: 'Layman',
            url: 'http://localhost:8087',
            user: 'anonymous',
            type: 'layman',
            liferayProtocol: 'https',
          },
        ],
        proxyPrefix: window.location.hostname.includes('localhost')
          ? `${window.location.protocol}//${window.location.hostname}:8085/`
          : '/proxy/',
        panelsEnabled: {
          tripPlanner: true,
          info: true,
          compositionLoadingProgress: true,
        },
        componentsEnabled: {
          geolocationButton: true,
          guiOverlay: true,
        },
        assetsPath: 'assets/hslayers-ng',
        symbolizerIcons: [
          {name: 'bag', url: '/assets/icons/bag1.svg'},
          {name: 'banking', url: '/assets/icons/banking4.svg'},
          {name: 'bar', url: '/assets/icons/bar.svg'},
          {name: 'beach', url: '/assets/icons/beach17.svg'},
          {name: 'bicycles', url: '/assets/icons/bicycles.svg'},
          {name: 'building', url: '/assets/icons/building103.svg'},
          {name: 'bus', url: '/assets/icons/bus4.svg'},
        ],
        popUpDisplay: 'hover',
        panelWidths: {statistics: 600, 'statistics-upload': 700},
        translationOverrides: {
          en: {
            SIDEBAR: {
              descriptions: {
                UPLOAD: 'Upload tabular data',
                STATISTICS: 'Calculate statistics',
              },
            },
            PANEL_HEADER: {
              STATISTICS: 'Statistics',
              UPLOAD: 'Upload tabular data',
            },
            ERROR_DIALOG: {
              MISSING_LAYER: 'Missing layer for visualization',
              MAKE_SURE_YOU_HAVE:
                'Make sure You have selected layer before trying to visualize the data on the map!',
              ERROR_STORING_DATA: 'Error storing data to localStorage',
            },
          },
        },
        default_layers: [
          new Tile({
            source: new OSM(),
            visible: true,
            properties: {
              title: 'OpenStreetMap',
              base: true,
              removable: false,
            },
          }),

          latvianMuni,
          vidzemeMuni,
          nuts0,
          nuts1,
          nuts2,
          nuts3,
        ],
      },
      this.app
    );
    hsLayoutService.createPanel(HsQueryComponent, this.app, {});
    this.hsStatisticsService.init();
    hsLayoutService.createPanel(HsLayerManagerComponent, this.app, {
      app: this.app,
    });
    hsLayoutService.createPanel(HsStylerComponent, this.app, {});
    hsToolbarPanelContainerService.create(
      HsSearchToolbarComponent,
      {},
      this.app
    );
    hsQueryPopupService.init(this.app);
    hsLayoutService.createOverlay(HsQueryPopupComponent, this.app, {
      service: hsQueryPopupService,
    });
    hsLayoutService.setMainPanel('layermanager');
    this.statisticsAppRef = hsStatisticsService.get('default');
  }
  title = 'hslayers-workspace';

  async loadFeatureToSrc(url: string, vidzemeMuniSrc) {
    try {
      const response: any = await lastValueFrom(
        this.httpClient.get(url).pipe(catchError(async (e) => {}))
      );
      vidzemeMuniSrc.addFeatures(
        new GeoJSON().readFeatures(response, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        })
      );
    } catch (error) {}
  }

  showHelp(which: string): void {
    const helpConfigMap = {
      upload: {
        image: 'assets/upload.gif',
      },
      timeSeries: {
        image: 'assets/time-series.gif',
      },
      map: {
        image: 'assets/map.gif',
      },
      correlation: {
        image: 'assets/correlation.gif',
      },
      regression: {
        image: 'assets/regression.gif',
      },
      predict: {
        image: 'assets/predict.gif',
      },
    };
    this.hsDialogContainerService.create(
      HsStatisticsHelpDialogComponent,
      helpConfigMap[which],
      'default'
    );
  }
}
