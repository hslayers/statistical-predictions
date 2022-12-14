import {Component, ElementRef, OnDestroy, ViewRef} from '@angular/core';

import {Subject} from 'rxjs';

@Component({
  selector: 'info',
  templateUrl: './info-dialog.component.html',
})
export class InfoDialogComponent implements OnDestroy {
  private end = new Subject<void>();
  viewRef: ViewRef;
  data: any;
  visible = true;

  constructor(public elementRef: ElementRef) {}

  close(): void {
    this.visible = false;
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}
