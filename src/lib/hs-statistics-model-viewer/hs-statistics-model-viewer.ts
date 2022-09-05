import {Component, Input, OnChanges, OnInit} from '@angular/core';

import {HsLanguageService} from 'hslayers-ng';
import {
  HsStatisticsService,
  Prediction,
  StatisticsServiceParams,
} from '../statistics.service';

@Component({
  selector: 'hs-statistics-model-viewer',
  templateUrl: './hs-statistics-model-viewer.html',
})
export class HsStatisticsModelViewerComponent implements OnInit {
  @Input() model: Prediction;
  @Input() app = 'default';
  decimals = 6;
  appRef: StatisticsServiceParams;

  constructor(
    private hsLanguageService: HsLanguageService,
    private hsStatisticsService: HsStatisticsService
  ) {}

  ngOnInit(): void {
    this.appRef = this.hsStatisticsService.get(this.app);
  }

  increaseDecimals(): void {
    this.decimals++;
  }

  decreaseDecimals(): void {
    this.decimals--;
  }
}
