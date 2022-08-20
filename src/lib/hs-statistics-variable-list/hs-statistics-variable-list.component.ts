import {Component, Input, OnInit} from '@angular/core';
import {HsDialogContainerService} from 'hslayers-ng';

import {HsStatisticsService} from '../statistics.service';
import {HsStatisticsTimeSeriesChartDialogComponent} from '../time-series-chart-dialog.component';
import {HsStatisticsToMapDialogComponent} from '../to-map-dialog.component';

@Component({
  selector: 'hs-statistics-variable-list',
  templateUrl: './hs-statistics-variable-list.component.html',
  styleUrls: ['./hs-statistics-variable-list.component.sass'],
})
export class HsStatisticsVariableListComponent implements OnInit {
  @Input() app = 'default';
  appRef;
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
    this.hsDialogContainerService.create(
      HsStatisticsToMapDialogComponent,
      {
        rows: this.hsStatisticsService.get(this.app).corpus.dict,
        columns: this.hsStatisticsService.get(this.app).corpus.variables,
        uses: this.hsStatisticsService.get(this.app).corpus.uses,
      },
      this.app
    );
  }

  timeSeries(): void {
    this.hsDialogContainerService.create(
      HsStatisticsTimeSeriesChartDialogComponent,
      {
        rows: this.hsStatisticsService.get(this.app).corpus.dict,
        columns: this.hsStatisticsService.get(this.app).corpus.variables,
        uses: this.hsStatisticsService.get(this.app).corpus.uses,
        app: this.app,
      },
      this.app
    );
  }
}
