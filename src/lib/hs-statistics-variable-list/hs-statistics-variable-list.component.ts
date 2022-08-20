import {Component, Input, OnInit} from '@angular/core';

import {HsStatisticsService} from '../statistics.service';

@Component({
  selector: 'hs-statistics-variable-list',
  templateUrl: './hs-statistics-variable-list.component.html',
  styleUrls: ['./hs-statistics-variable-list.component.sass'],
})
export class HsStatisticsVariableListComponent implements OnInit {
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
