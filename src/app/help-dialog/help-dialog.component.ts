import {Component, Input, ViewRef} from '@angular/core';

import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

@Component({
  selector: 'help-dialog',
  templateUrl: './help-dialog.component.html',
})
export class HsStatisticsHelpDialogComponent implements HsDialogComponent {
  @Input() data: {
    image: string;
    app: string;
  };
  viewRef: ViewRef;

  constructor(public hsDialogContainerService: HsDialogContainerService) {}

  close(): void {
    this.hsDialogContainerService.destroy(this, this.data.app);
  }
}
