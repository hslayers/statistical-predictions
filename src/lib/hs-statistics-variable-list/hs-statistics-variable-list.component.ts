import {Component, Input, OnInit} from '@angular/core';
import {HsDialogContainerService} from 'hslayers-ng';
import {HsStatisticsMapControllerDialogComponent} from '../hs-statistics-map-controller-dialog/hs-statistics-map-controller-dialog.component';
import {HsStatisticsTimeSeriesDialogComponent} from '../hs-statistics-time-series-dialog/hs-statistics-time-series-dialog.component';

import {HsStatisticsService} from '../statistics.service';

@Component({
  selector: 'hs-statistics-variable-list',
  templateUrl: './hs-statistics-variable-list.component.html',
  styleUrls: ['./hs-statistics-variable-list.component.sass'],
})
export class HsStatisticsVariableListComponent implements OnInit {
  @Input() app = 'default';
  @Input() dialogMode = false;
  appRef;
  @Input() timeSeriesElementRef?: HTMLElement;
  @Input() mapVisualizerElementRef?: HTMLElement;
  constructor(
    private hsStatisticsService: HsStatisticsService,
    private hsDialogContainerService: HsDialogContainerService
  ) {}

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

  clearAll(): void {
    this.hsStatisticsService.clear(this.app);
  }

  visualizeInMap(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsMapControllerDialogComponent,
        {
          rows: this.hsStatisticsService.get(this.app).corpus.dict,
          columns: this.hsStatisticsService.get(this.app).corpus.variables,
          uses: this.hsStatisticsService.get(this.app).corpus.uses,
        },
        this.app
      );
    } else {
      this.scroll(this.mapVisualizerElementRef);
    }
  }

  timeSeries(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsTimeSeriesDialogComponent,
        {
          rows: this.hsStatisticsService.get(this.app).corpus.dict,
          columns: this.hsStatisticsService.get(this.app).corpus.variables,
          uses: this.hsStatisticsService.get(this.app).corpus.uses,
          app: this.app,
        },
        this.app
      );
    } else {
      this.scroll(this.timeSeriesElementRef);
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
}
