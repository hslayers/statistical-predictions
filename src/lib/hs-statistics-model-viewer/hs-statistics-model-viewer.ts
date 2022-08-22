import {Component, Input, OnChanges} from '@angular/core';

import {HsLanguageService} from 'hslayers-ng';
import {Prediction} from '../statistics.service';

@Component({
  selector: 'hs-statistics-model-viewer',
  templateUrl: './hs-statistics-model-viewer.html',
})
export class HsStatisticsModelViewerComponent {
  @Input() model: Prediction;

  constructor(private hsLanguageService: HsLanguageService) {}
}
