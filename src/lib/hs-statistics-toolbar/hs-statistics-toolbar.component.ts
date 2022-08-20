import {Component, Input, OnInit} from '@angular/core';
import {HsDialogContainerService} from 'hslayers-ng';
import {HsStatisticsCorrelationsDialogComponent} from '../hs-statistics-correlations-dialog/correlations-dialog.component';

import {HsStatisticsPredictionDialogComponent} from '../hs-statistics-prediction-dialog/prediction-dialog.component';
import {HsStatisticsRegressionDialogComponent} from '../hs-statistics-regression-dialog/regression-dialog.component';
import {HsStatisticsService} from '../statistics.service';

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

  regression(): void {
    this.hsDialogContainerService.create(
      HsStatisticsRegressionDialogComponent,
      {app: this.app},
      this.app
    );
  }

  predict(): void {
    this.hsDialogContainerService.create(
      HsStatisticsPredictionDialogComponent,
      {app: this.app},
      this.app
    );
  }
}
