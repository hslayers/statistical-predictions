import {Component, ElementRef, OnDestroy, ViewRef} from '@angular/core';

import {HsDialogComponent, HsDialogContainerService} from 'hslayers-ng';

import {Subject} from 'rxjs';

@Component({
  selector: 'hs-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class HsErrorDialogComponent implements HsDialogComponent, OnDestroy {
  private end = new Subject<void>();
  viewRef: ViewRef;
  data: {
    header: string;
    errorMessage: string;
    app: string;
  };

  constructor(
    private hsDialogContainerService: HsDialogContainerService,
    public elementRef: ElementRef
  ) {}

  close(): void {
    this.hsDialogContainerService.destroy(this, this.data.app);
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
