import {Component, Input, ViewRef} from '@angular/core';

import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

@Component({
  selector: 'hs-correlations-dialog',
  templateUrl: './correlations-dialog.component.html',
})
export class HsStatisticsCorrelationsDialogComponent
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
