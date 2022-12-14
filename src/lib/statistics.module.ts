import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {HsDownloadModule, HsLanguageModule} from 'hslayers-ng';
import {HsPanelHelpersModule, HsUploadModule} from 'hslayers-ng';
import {NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {AbsPipe} from './abs.pipe';
import {HsErrorDialogComponent} from './error-dialog/error-dialog.component';
import {HsSketchFunctionComponent} from './sketch-function.component';
import {HsStatisticsCorrelationsComponent} from './hs-statistics-correlations/hs-statistics-correlations.component';
import {HsStatisticsCorrelationsDialogComponent} from './hs-statistics-correlations-dialog/correlations-dialog.component';
import {HsStatisticsHistogramComponent} from './histogram-chart-dialog.component';
import {HsStatisticsMapControllerComponent} from './hs-statistics-map-controller/hs-statistics-map-controller.component';
import {HsStatisticsMapControllerDialogComponent} from './hs-statistics-map-controller-dialog/hs-statistics-map-controller-dialog.component';
import {HsStatisticsModelViewerComponent} from './hs-statistics-model-viewer/hs-statistics-model-viewer';
import {HsStatisticsPanelComponent} from './statistics-panel.component';
import {HsStatisticsPredictionComponent} from './hs-statistics-prediction/hs-statistics-prediction.component';
import {HsStatisticsPredictionDialogComponent} from './hs-statistics-prediction-dialog/prediction-dialog.component';
import {HsStatisticsRegressionComponent} from './hs-statistics-regression/hs-statistics-regression.component';
import {HsStatisticsRegressionDialogComponent} from './hs-statistics-regression-dialog/regression-dialog.component';
import {HsStatisticsTimeSeriesChartComponent} from './hs-statistics-time-series-chart/time-series-chart';
import {HsStatisticsTimeSeriesComponent} from './hs-statistics-time-series/hs-statistics-time-series.component';
import {HsStatisticsTimeSeriesDialogComponent} from './hs-statistics-time-series-dialog/hs-statistics-time-series-dialog.component';
import {HsStatisticsToolbarComponent} from './hs-statistics-toolbar/hs-statistics-toolbar.component';
import {HsStatisticsUploadPanelComponent} from './hs-statistics-upload-panel/hs-statistics-upload-panel';
import {HsStatisticsVariableListComponent} from './hs-statistics-variable-list/hs-statistics-variable-list.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HsStatisticsPanelComponent,
    HsStatisticsUploadPanelComponent,
    HsStatisticsCorrelationsComponent,
    HsStatisticsCorrelationsDialogComponent,
    HsStatisticsMapControllerComponent,
    HsStatisticsMapControllerDialogComponent,
    HsStatisticsTimeSeriesChartComponent,
    HsStatisticsTimeSeriesComponent,
    HsStatisticsTimeSeriesDialogComponent,
    HsStatisticsRegressionComponent,
    HsStatisticsRegressionDialogComponent,
    HsStatisticsHistogramComponent,
    HsStatisticsPredictionComponent,
    HsStatisticsPredictionDialogComponent,
    AbsPipe,
    HsStatisticsModelViewerComponent,
    HsSketchFunctionComponent,
    HsErrorDialogComponent,
    HsStatisticsToolbarComponent,
    HsStatisticsVariableListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HsPanelHelpersModule,
    HsLanguageModule,
    HsUploadModule,
    NgbDropdownModule,
    NgbNavModule,
    HsDownloadModule,
  ],
  exports: [
    HsStatisticsPanelComponent,
    HsStatisticsUploadPanelComponent,
    HsStatisticsCorrelationsComponent,
    HsStatisticsMapControllerComponent,
    HsStatisticsMapControllerDialogComponent,
    HsStatisticsTimeSeriesChartComponent,
    HsStatisticsTimeSeriesComponent,
    HsStatisticsTimeSeriesDialogComponent,
    HsStatisticsRegressionComponent,
    HsStatisticsRegressionDialogComponent,
    HsStatisticsPredictionComponent,
    HsStatisticsPredictionDialogComponent,
    HsStatisticsHistogramComponent,
    HsStatisticsTimeSeriesChartComponent,
    HsSketchFunctionComponent,
    HsErrorDialogComponent,
    HsStatisticsToolbarComponent,
    HsStatisticsVariableListComponent,
    HsStatisticsCorrelationsDialogComponent,
    HsStatisticsModelViewerComponent,
  ],
})
export class HsStatisticsModule {}
