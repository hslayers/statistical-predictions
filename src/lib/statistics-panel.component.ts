import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {
  HsConfig,
  HsLayoutService,
  HsPanelBaseComponent,
  HsSidebarService,
} from 'hslayers-ng';
import {HsStatisticsService} from './statistics.service';

@Component({
  selector: 'hs-statistics',
  templateUrl: './statistics-panel.component.html',
  styleUrls: ['../styles.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class HsStatisticsPanelComponent
  extends HsPanelBaseComponent
  implements OnInit {
  public title = '';
  name = 'statistics';
  appRef;
  constructor(
    private hsStatisticsService: HsStatisticsService,
    private hsConfig: HsConfig,
    hsLayoutService: HsLayoutService,
    private hsSidebarService: HsSidebarService,
  ) {
    super(hsLayoutService);
  }

  ngOnInit() {
    this.hsSidebarService.addButton(
      {
        panel: 'statistics',
        module: 'hs.statistics',
        order: 10,
        fits: true,
        visible: true,
        title: 'PANEL_HEADER.STATISTICS',
        description: 'SIDEBAR.descriptions.STATISTICS',
        icon: 'statistics-icon-barchartasc',
      },
      this.data.app
    );
    this.setConfig();
    this.hsStatisticsService.init(this.data.app);
    this.appRef = this.hsStatisticsService.get(this.data.app);
  }
  setConfig() {
    this.hsConfig.update(
      {
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
              OPTIONAL: '(optional)',
              PREDICTIONS: 'Predictions',
              FROM: 'From',
              TILL: 'Till',
              STORE_MODEL: 'Store model',
              MODEL_NAME: 'Model name',
              FUNCTION: 'Function',
              DRAG_TO_DRAW: 'Drag mouse in this area to draw',
            },
          },
        },
      },
      this.data.app
    );
  }
}
