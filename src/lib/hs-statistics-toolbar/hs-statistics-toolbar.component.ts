import {Component, Input, OnInit} from '@angular/core';
import {HsDialogContainerService} from 'hslayers-ng';
import {HsStatisticsCorrelationsDialogComponent} from '../hs-statistics-correlations-dialog/correlations-dialog.component';

import {HsStatisticsPredictionChartDialogComponent} from '../prediction-chart-dialog.component';
import {HsStatisticsRegressionDialogComponent} from '../hs-statistics-regression-dialog/regression-dialog.component';
import {HsStatisticsService} from '../statistics.service';
import {HsStatisticsTimeSeriesChartDialogComponent} from '../time-series-chart-dialog.component';
import {HsStatisticsToMapDialogComponent} from '../to-map-dialog.component';

@Component({
  selector: 'hs-statistics-toolbar',
  templateUrl: './hs-statistics-toolbar.component.html',
  styleUrls: ['./hs-statistics-toolbar.component.sass'],
})
export class HsStatisticsToolbarComponent {
  @Input() app = 'default';

  constructor(
    private hsDialogContainerService: HsDialogContainerService,
    private hsStatisticsService: HsStatisticsService
  ) {}

  correlate(): void {
    this.hsDialogContainerService.create(
      HsStatisticsCorrelationsDialogComponent,
      {
        correlate: this.hsStatisticsService.correlate({}, this.app),
        app: this.app,
      },
      this.app
    );
  }

  visualizeInMap(): void {
    this.hsDialogContainerService.create(
      HsStatisticsToMapDialogComponent,
      {
        rows: this.hsStatisticsService.get(this.app).corpus.dict,
        columns: this.hsStatisticsService.get(this.app).corpus.variables,
        uses: this.hsStatisticsService.get(this.app).corpus.uses,
      },
      this.app
    );
  }

  timeSeries(): void {
    this.hsDialogContainerService.create(
      HsStatisticsTimeSeriesChartDialogComponent,
      {
        rows: this.hsStatisticsService.get(this.app).corpus.dict,
        columns: this.hsStatisticsService.get(this.app).corpus.variables,
        uses: this.hsStatisticsService.get(this.app).corpus.uses,
        app: this.app,
      },
      this.app
    );
  }

  regression(): void {
    this.hsDialogContainerService.create(
      HsStatisticsRegressionDialogComponent,
      {app: this.app},
      this.app
    );
  }

  predict(): void {
    this.hsDialogContainerService.create(
      HsStatisticsPredictionChartDialogComponent,
      {app: this.app},
      this.app
    );
  }

  clearAll(): void {
    this.hsStatisticsService.clear(this.app);
  }
}
