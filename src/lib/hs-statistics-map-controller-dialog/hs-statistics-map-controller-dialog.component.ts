import {Component, Input, ViewRef} from '@angular/core';

import {CorpusItemValues, Usage} from '../statistics.service';
import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

@Component({
  selector: 'hs-statistics-map-controller-dialog',
  templateUrl: './hs-statistics-map-controller-dialog.component.html',
})
export class HsStatisticsMapControllerDialogComponent
  implements HsDialogComponent
{
  @Input() data: {
    rows: any[] | {[key: string]: {values: CorpusItemValues}};
    columns: string[];
    uses: Usage;
    app: string;
  };
  viewRef: ViewRef;

  constructor(public hsDialogContainerService: HsDialogContainerService) {}

  close(): void {
    this.hsDialogContainerService.destroy(this, this.data.app);
  }
}
