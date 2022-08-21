import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, lastValueFrom} from 'rxjs';

import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import {OSM, Vector as VectorSource, XYZ} from 'ol/source';
import {Tile} from 'ol/layer';

import {
  HsConfig,
  HsLayerManagerComponent,
  HsLayoutService,
  HsQueryComponent,
  HsQueryPopupComponent,
  HsQueryPopupService,
  HsSearchToolbarComponent,
  HsStylerComponent,
  HsToolbarPanelContainerService,
} from 'hslayers-ng';
import {HsStatisticsService} from '../lib/statistics.service';
import {defaultStyleSld} from './default-style';

@Component({
  selector: 'hslayers-app',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class HslayersAppComponent {
  app = 'default';
  constructor(
    public HsConfig: HsConfig,
    private httpClient: HttpClient,
    hsLayoutService: HsLayoutService,
    hsQueryPopupService: HsQueryPopupService,
    hsToolbarPanelContainerService: HsToolbarPanelContainerService,
    public hsStatisticsService: HsStatisticsService
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
          attributes: ['na', 'value'],
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
          attributes: ['na', 'value'],
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
            STATISTICS: {
              AGO: 'ago',
              BY: 'by',
              CLEAR_ALL_DATA: 'Clear all data',
              CLEAR_ALL_STATISTICS_DATA:
                'Do you really want to clear all statistics data?',
              COLLAPSE_ROWS: 'Collapse rows',
              CORRELATE: 'Correlate',
              CORRELATION_MATRIX: 'Correlation matrix',
              CORRELATIONS: 'Correlations',
              CURRENT_VARIABLES: 'Current variables',
              DESCRIPTIVE_STATISTICS: 'Descriptive statistics',
              FREQUENCY: 'Frequency',
              INTERVALS: 'Intervals',
              LOCATION_FILTER: 'Location',
              MAXIMUM: 'Maximum',
              MEAN_ABSOLUTE_DEVIATION: 'Mean absolute deviation',
              MEAN: 'Mean',
              MEDIAN: 'Median',
              MINIMUM: 'Minimum',
              MODE: 'Mode',
              NUMBER_OF_STUDENTS: 'Number of students',
              PEARSONS_OFFSET_COEFFICIENT: "Pearson's offset coefficient",
              PREDICT: 'Predict',
              REGRESSION_TYPE: 'Type',
              REGRESSION: 'Regression',
              removeVariable: 'Remove variable',
              SHIFT: 'Shift',
              STANDARD_DEVIATION: 'Standard deviation',
              STORE: 'Store',
              TIME_FILTER: 'Filter by time',
              TIME_SERIES_CHART: 'Time series chart',
              TIMESTAMP: 'Timestamp',
              VALUE: 'Value',
              VARIABLE_LIST: 'Variable list',
              VARIABLE: 'Variable',
              VARIABLES: 'Variables',
              VARIANCE: 'Variance',
              VISUALIZE_MAP: 'To map',
              VISUALIZE: 'Visualize',
              YEARS: 'years',
              LOCATION_PROPERTY: 'Location property',
              DOWNLOAD_TEMPLATE_HINT: `Upload data in CSV format. A template can be downloaded`,
              HERE: 'here',
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
}
