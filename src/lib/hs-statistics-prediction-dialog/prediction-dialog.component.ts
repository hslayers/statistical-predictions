import {Component, Input, ViewRef} from '@angular/core';

import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

@Component({
  selector: 'hs-statistics-prediction-dialog',
  templateUrl: './prediction-dialog.component.html',
})
export class HsStatisticsPredictionDialogComponent
  implements HsDialogComponent
{
  @Input() data: {
    correlate: any;
    app: string;
  };
  viewRef: ViewRef;

  constructor(public hsDialogContainerService: HsDialogContainerService) {}

  close(): void {
    this.hsDialogContainerService.destroy(this, this.data.app);
  }
}
