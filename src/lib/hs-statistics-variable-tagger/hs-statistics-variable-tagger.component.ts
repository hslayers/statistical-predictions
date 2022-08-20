import {Component, Input, OnInit} from '@angular/core';

import {HsStatisticsService} from '../statistics.service';

@Component({
  selector: 'hs-statistics-variable-tagger',
  templateUrl: './hs-statistics-variable-tagger.component.html',
  styleUrls: ['./hs-statistics-variable-tagger.component.sass'],
})
export class HsStatisticsVariableTaggerComponent implements OnInit {
  @Input() app = 'default';
  appRef;
  constructor(private hsStatisticsService: HsStatisticsService) {}

  ngOnInit(): void {
    this.appRef = this.hsStatisticsService.get(this.app);
  }

  removeVariable(varSelected: string) {
    if (varSelected) {
      this.hsStatisticsService.get(this.app).corpus.variables =
        this.hsStatisticsService
          .get(this.app)
          .corpus.variables.filter((variable) => variable != varSelected);
    }
  }
}
