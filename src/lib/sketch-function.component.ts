import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import {HsDialogContainerService, HsLayerUtilsService} from 'hslayers-ng';

@Component({
  selector: 'hs-sketch-function',
  templateUrl: './sketch-function.component.html',
})
export class HsSketchFunctionComponent implements AfterViewInit {
  @Input() years: string[];
  @Input() app = 'default';
  @ViewChild('canvas') canvas: ElementRef;
  mouseDown: boolean;
  maxValue = 500;
  values: any = {};
  @Output() set = new EventEmitter<{
    [key: string]: number;
  }>();

  constructor(
    public hsDialogContainerService: HsDialogContainerService,
    public hsLayerUtilsService: HsLayerUtilsService
  ) {}

  ngAfterViewInit() {
    this.canvas.nativeElement.addEventListener('mousemove', (e) =>
      this.mouseMoved(e)
    );
    this.canvas.nativeElement.addEventListener(
      'mousedown',
      (e) => (this.mouseDown = true)
    );
    this.canvas.nativeElement.addEventListener(
      'mouseup',
      (e) => (this.mouseDown = false)
    );
    this.redraw();
  }
  mouseMoved(e: any) {
    const canvas = this.canvas.nativeElement;
    if (this.mouseDown) {
      const year =
        this.years[
          Math.round(
            (e.offsetX / this.canvas.nativeElement.width) *
              (this.years.length - 1)
          )
        ];
      this.values[year] =
        ((canvas.height - e.offsetY) / this.canvas.nativeElement.height) *
        this.maxValue;
      this.redraw();
      this.set.emit(this.values);
    }
  }
  redraw() {
    const canvas = this.canvas.nativeElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    ctx.beginPath();
    const year = Object.keys(this.values)[0];
    const x = this.scaleX(this.years.indexOf(year));
    const y = this.scaleY(this.values[year]);
    ctx.moveTo(x, y);
    for (const year of Object.keys(this.values)) {
      const x = this.scaleX(this.years.indexOf(year));
      const y = this.scaleY(this.values[year]);
      ctx.lineTo(x, y);
    }
    ctx.setLineDash([5, 9]);
    ctx.strokeStyle = '#4F6CFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  scaleY(y: number) {
    const canvas = this.canvas.nativeElement;
    return canvas.height - (y / this.maxValue) * canvas.height;
  }

  scaleX(x: number) {
    const canvas = this.canvas.nativeElement;
    return x * (canvas.width / (this.years.length - 1));
  }
}
