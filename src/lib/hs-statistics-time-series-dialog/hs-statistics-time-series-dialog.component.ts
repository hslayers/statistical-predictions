import {Component, Input, ViewRef} from '@angular/core';

import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

@Component({
  selector: 'hs-statistics-time-series-dialog',
  templateUrl: './hs-statistics-time-series-dialog.component.html',
})
export class HsStatisticsTimeSeriesDialogComponent
  implements HsDialogComponent
{
  @Input() data: {
    app: string;
  };
  viewRef: ViewRef;

  constructor(public hsDialogContainerService: HsDialogContainerService) {}

  close(): void {
    this.hsDialogContainerService.destroy(this, this.data.app);
  }
}
