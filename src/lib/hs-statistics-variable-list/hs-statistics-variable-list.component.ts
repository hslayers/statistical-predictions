import {Component, Input, OnInit} from '@angular/core';
import {HsDialogContainerService} from 'hslayers-ng';

import {HsStatisticsMapControllerComponent} from '../hs-statistics-map-controller/hs-statistics-map-controller.component';
import {HsStatisticsMapControllerDialogComponent} from '../hs-statistics-map-controller-dialog/hs-statistics-map-controller-dialog.component';
import {HsStatisticsService} from '../statistics.service';
import {HsStatisticsTimeSeriesComponent} from '../hs-statistics-time-series/hs-statistics-time-series.component';
import {HsStatisticsTimeSeriesDialogComponent} from '../hs-statistics-time-series-dialog/hs-statistics-time-series-dialog.component';
import {variance} from 'simple-statistics';

@Component({
  selector: 'hs-statistics-variable-list',
  templateUrl: './hs-statistics-variable-list.component.html',
  styleUrls: ['./hs-statistics-variable-list.component.sass'],
})
export class HsStatisticsVariableListComponent implements OnInit {
  @Input() app = 'default';
  @Input() dialogMode = false;
  appRef;
  @Input() mapControllerComponent?: HsStatisticsMapControllerComponent;
  @Input() timeSeriesComponent?: HsStatisticsTimeSeriesComponent;
  constructor(
    private hsStatisticsService: HsStatisticsService,
    private hsDialogContainerService: HsDialogContainerService
  ) {}

  ngOnInit(): void {
    this.appRef = this.hsStatisticsService.get(this.app);
  }

  removeVariable(varSelected: string) {
    if (varSelected) {
      const corpus = this.hsStatisticsService.get(this.app).corpus;
      corpus.variables = corpus.variables.filter(
        (variable) => variable != varSelected
      );
      for (const key of Object.keys(corpus.dict)) {
        if (corpus.dict[key].values[varSelected] !== undefined) {
          delete corpus.dict[key].values[varSelected];
          if (Object.keys(corpus.dict[key].values).length == 0) {
            delete corpus.dict[key];
          }
        }
      }
      delete corpus.uses[varSelected];
      delete corpus.timeConfig[varSelected];
      this.hsStatisticsService.afterVariablesChange(this.app);
      this.hsStatisticsService.save(this.app);
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
      this.hsStatisticsService.scroll(this.mapControllerComponent.elementRef);
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
      this.hsStatisticsService.scroll(this.timeSeriesComponent.elementRef);
    }
  }
}
