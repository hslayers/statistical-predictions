import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {HsDownloadModule, HsLanguageModule} from 'hslayers-ng';
import {HsPanelHelpersModule, HsUploadModule} from 'hslayers-ng';
import {NgbDropdownModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {AbsPipe} from './abs.pipe';
import {HsErrorDialogComponent} from './error-dialog/error-dialog.component';
import {HsSketchFunctionComponent} from './sketch-function.component';
import {HsStatisticsCorrelationsComponent} from './correlations.component';
import {HsStatisticsHistogramComponent} from './histogram-chart-dialog.component';
import {HsStatisticsPanelComponent} from './statistics-panel.component';
import {HsStatisticsPredictionChartDialogComponent} from './prediction-chart-dialog.component';
import {HsStatisticsRegressionDialogComponent} from './regression-dialog.component';
import {HsStatisticsTimeSeriesChartComponent} from './time-series-chart';
import {HsStatisticsTimeSeriesChartDialogComponent} from './time-series-chart-dialog.component';
import {HsStatisticsToMapDialogComponent} from './to-map-dialog.component';
import {HsStatisticsUploadPanelComponent} from './upload-panel';
import { HsStatisticsToolbarComponent } from './hs-statistics-toolbar/hs-statistics-toolbar.component';
import { HsStatisticsVariableListComponent } from './hs-statistics-variable-list/hs-statistics-variable-list.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HsStatisticsPanelComponent,
    HsStatisticsUploadPanelComponent,
    HsStatisticsCorrelationsComponent,
    HsStatisticsToMapDialogComponent,
    HsStatisticsTimeSeriesChartDialogComponent,
    HsStatisticsRegressionDialogComponent,
    HsStatisticsHistogramComponent,
    HsStatisticsPredictionChartDialogComponent,
    AbsPipe,
    HsStatisticsTimeSeriesChartComponent,
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
    HsStatisticsToMapDialogComponent,
    HsStatisticsTimeSeriesChartDialogComponent,
    HsStatisticsRegressionDialogComponent,
    HsStatisticsPredictionChartDialogComponent,
    HsStatisticsHistogramComponent,
    HsStatisticsTimeSeriesChartComponent,
    HsSketchFunctionComponent,
    HsErrorDialogComponent,
    HsStatisticsToolbarComponent,
    HsStatisticsVariableListComponent,
  ],
})
export class HsStatisticsModule {}
