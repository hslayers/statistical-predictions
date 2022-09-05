import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  HsStatisticsService,
  ShiftBy,
  StatisticsServiceParams,
} from '../statistics.service';

export enum Tabs {
  varList = 'variableList',
  corrMatrix = 'correlationMatrix',
}

@Component({
  selector: 'hs-statistics-correlations',
  templateUrl: './hs-statistics-correlations.component.html',
  styleUrls: ['./hs-statistics-correlations.component.sass'],
})
export class HsStatisticsCorrelationsComponent implements OnInit {
  tabs = Tabs;
  @Input() correlate: any;
  @Input() app = 'default';
  @Input() dialogMode = false;
  @Output() closed = new EventEmitter<void>();

  tabSelected = Tabs.varList;
  shifts: ShiftBy = {};
  appRef: StatisticsServiceParams;

  constructor(
    private hsStatisticsService: HsStatisticsService,
    public elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.appRef = this.hsStatisticsService.get(this.app);
    this.hsStatisticsService.variableChanges.subscribe(() => {
      this.correlate = this.hsStatisticsService.correlations;
    });
  }

  updateShifting(variable: string, shiftBy: number) {
    this.shifts[variable] = shiftBy;
    this.correlate = this.hsStatisticsService.correlate(this.shifts, this.app);
  }

  tabSelect(tabTitle: Tabs): void {
    this.tabSelected = tabTitle;
  }

  close(): void {
    this.closed.emit();
  }
}
