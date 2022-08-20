import {Component, Input, OnInit} from '@angular/core';
import {HsStatisticsService, ShiftBy} from '../statistics.service';

export enum Tabs {
  varList = 'variableList',
  corrMatrix = 'correlationMatrix',
}

@Component({
  selector: 'hs-statistics-correlations',
  templateUrl: './hs-statistics-correlations.component.html',
  styleUrls: ['./hs-statistics-correlations.component.sass'],
})
export class HsStatisticsCorrelationsComponent {
  tabs = Tabs;
  @Input() correlate: any;
  @Input() app = 'default';
  @Input() dialogMode = false;

  tabSelected = Tabs.varList;
  shifts: ShiftBy = {};

  constructor(private hsStatisticsService: HsStatisticsService) {}

  updateShifting(variable: string, shiftBy: number) {
    this.shifts[variable] = shiftBy;
    this.correlate = this.hsStatisticsService.correlate(this.shifts, this.app);
  }

  tabSelect(tabTitle: Tabs): void {
    this.tabSelected = tabTitle;
  }

  close(): void {}
}
