import {Component, ElementRef, Input} from '@angular/core';

import {HsDialogContainerService} from 'hslayers-ng';
import {HsStatisticsCorrelationsComponent} from '../hs-statistics-correlations/hs-statistics-correlations.component';
import {HsStatisticsCorrelationsDialogComponent} from '../hs-statistics-correlations-dialog/correlations-dialog.component';
import {HsStatisticsPredictionComponent} from '../hs-statistics-prediction/hs-statistics-prediction.component';
import {HsStatisticsPredictionDialogComponent} from '../hs-statistics-prediction-dialog/prediction-dialog.component';
import {HsStatisticsRegressionComponent} from '../hs-statistics-regression/hs-statistics-regression.component';
import {HsStatisticsRegressionDialogComponent} from '../hs-statistics-regression-dialog/regression-dialog.component';
import {HsStatisticsService} from '../statistics.service';

@Component({
  selector: 'hs-statistics-toolbar',
  templateUrl: './hs-statistics-toolbar.component.html',
  styleUrls: ['./hs-statistics-toolbar.component.sass'],
})
export class HsStatisticsToolbarComponent {
  @Input() app = 'default';
  dialogMode: any;
  @Input() predictionComponent?: HsStatisticsPredictionComponent;
  @Input() regressionComponent?: HsStatisticsRegressionComponent;
  @Input()
  correlationComponent?: HsStatisticsCorrelationsComponent;

  constructor(
    private hsDialogContainerService: HsDialogContainerService,
    private hsStatisticsService: HsStatisticsService
  ) {}

  correlate(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsCorrelationsDialogComponent,
        {
          correlate: this.hsStatisticsService.correlate({}, this.app),
          app: this.app,
        },
        this.app
      );
    } else {
      this.scroll(this.correlationComponent?.elementRef);
    }
  }

  regression(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsRegressionDialogComponent,
        {app: this.app},
        this.app
      );
    } else {
      this.scroll(this.regressionComponent?.elementRef);
    }
  }

  predict(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsPredictionDialogComponent,
        {app: this.app},
        this.app
      );
    } else {
      this.scroll(this.predictionComponent?.elementRef);
    }
  }

  scroll(el: ElementRef) {
    el.nativeElement.scrollIntoView({behavior: 'smooth'});
  }
}
