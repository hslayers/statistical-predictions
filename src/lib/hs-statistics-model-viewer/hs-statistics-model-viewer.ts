import {Component, Input, OnChanges} from '@angular/core';

import {HsLanguageService} from 'hslayers-ng';
import {Prediction} from '../statistics.service';

@Component({
  selector: 'hs-statistics-model-viewer',
  templateUrl: './hs-statistics-model-viewer.html',
})
export class HsStatisticsModelViewerComponent {
  @Input() model: Prediction;
  @Input() app = 'default';
  decimals = 6;

  constructor(private hsLanguageService: HsLanguageService) {}

  increaseDecimals(): void {
    this.decimals++;
  }

  decreaseDecimals(): void {
    this.decimals--;
  }
}
