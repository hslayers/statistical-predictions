import {Component, Input, ViewRef} from '@angular/core';

import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

@Component({
  selector: 'hs-regression-dialog',
  templateUrl: './regression-dialog.component.html',
})
export class HsStatisticsRegressionDialogComponent
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
