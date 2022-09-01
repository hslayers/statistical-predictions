import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewRef,
} from '@angular/core';

import {
  HsDialogContainerService,
  HsLayerUtilsService,
  HsUtilsService,
} from 'hslayers-ng';

import {ColumnWrapper} from '../column-wrapper.type';
import {
  CorpusDict,
  HsStatisticsService,
  Prediction,
} from '../statistics.service';

/**
 * Dialog window to choose variables and filters to visualize data on map.
 * Can be used both for uploaded, but not yet stored data or
 * data from stored corpus.
 */
@Component({
  selector: 'hs-statistics-prediction',
  templateUrl: './hs-statistics-prediction.component.html',
})
export class HsStatisticsPredictionComponent implements OnInit {
  @Input() app = 'default';
  @Input() dialogMode = false;
  @Output() closed = new EventEmitter<void>();
  viewRef: ViewRef;
  selectedLocation: any;
  timeValues: any[];
  timeColumn: string;
  filteredRows: any[];
  locationColumn: string;
  locationValues: string[];
  predictions: Prediction[];
  selectedModel: Prediction;
  variables: ColumnWrapper[];
  predictedVariable: string;
  fromYear = new Date().getFullYear();
  tillYear = new Date().getFullYear() + 10;
  years: number[];
  dict: CorpusDict;
  regressionParams: any;
  shifts = {};
  observations: any;
  functionSketchVisible = false;

  constructor(
    public hsDialogContainerService: HsDialogContainerService,
    public hsLayerUtilsService: HsLayerUtilsService,
    public hsStatisticsService: HsStatisticsService,
    private hsUtilsService: HsUtilsService,
    public elementRef: ElementRef
  ) {
    this.hsStatisticsService.predictionsAdded.subscribe((newPrediction) => {
      this.selectPrediction(newPrediction);
    });
  }

  ngOnInit(): void {
    this.locationColumn = 'location';
    this.timeColumn = 'time';
    this.fillModels();
  }

  private fillModels() {
    this.predictions = this.hsStatisticsService.get(this.app).predictions;
  }

  close(): void {
    this.closed.emit();
  }

  dateRangeChanged() {
    const range = (start: number, end: number) =>
      Array.from({length: end - start}, (v, k) => k + start);
    this.years = range(Math.floor(this.fromYear), Math.floor(this.tillYear));
    this.fillPlaceholders();
  }

  selectPrediction(prediction: Prediction) {
    this.selectedModel = prediction;
    this.variables = prediction.variables;
    this.regressionParams = prediction.coefficients;
    this.predictedVariable = prediction.predictedVariable;
    this.dict = Object.assign(
      {},
      this.hsStatisticsService.get(this.app).corpus.dict
    );
    const tmpLocValues = Object.keys(this.dict)
      .map((key) => this.dict[key])
      .map((row) => row.location);

    this.locationValues = tmpLocValues.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    this.shifts = this.variables.reduce(
      (obj, item) => Object.assign(obj, {[item.name]: item.shift}),
      {}
    );
    this.dateRangeChanged();
  }

  selectFilter(value: any): void {
    this.selectedLocation = value;
    this.applyFilters();
    this.visualize();
  }

  fillPlaceholders() {
    for (const year of this.years) {
      if (this.dict[this.selectedLocation + '::' + year] == undefined) {
        this.dict[this.selectedLocation + '::' + year] = {
          values: {},
          time: year.toString(),
          location: this.selectedLocation,
        };
      }
    }
  }

  predict() {
    for (const year of this.years) {
      let tmp = 0;
      if (
        this.regressionParams?.variables &&
        this.regressionParams.variables?.length > 0
      ) {
        for (const variable of this.regressionParams.variables) {
          const key = this.hsStatisticsService.adjustDictionaryKey(
            this.dict,
            this.selectedLocation + '::' + year,
            variable.name,
            this.shifts
          );
          if (this.dict[key] === undefined) {
            tmp = null;
            continue;
          }
          tmp += variable.coefficient * this.dict[key].values[variable.name];
        }

        if (tmp !== null) {
          tmp += this.regressionParams.constant;
        }
        this.dict[this.selectedLocation + '::' + year].values[
          this.predictedVariable
        ] = tmp;
      }
      this.visualize();
    }
  }

  applyFilters() {
    this.filteredRows = Object.keys(this.dict)
      .map((key) => this.dict[key])
      .filter((row) => row.location == this.selectedLocation);
  }

  async visualize(): Promise<void> {
    this.observations = [];
    const variables = this.regressionParams?.variables
      ? this.regressionParams.variables
      : [];
    for (const year of this.years) {
      for (const variable of [...variables, {name: this.predictedVariable}]) {
        this.observations.push({
          name: variable.name,
          time: year.toString(),
          value:
            this.dict[this.selectedLocation + '::' + `${year}`]?.values[
              variable.name
            ],
        });
      }
    }
  }

  functionSketched(variableName, e: {[key: string]: number}) {
    for (const year of Object.keys(e)) {
      this.dict[this.selectedLocation + '::' + year].values[variableName] =
        e[year];
    }
    this.hsUtilsService.debounce(
      () => {
        this.predict();
      },
      200,
      false,
      this
    )();
  }

  removeModel(): void {
    this.hsStatisticsService.removeModel(this.selectedModel, this.app);
    this.selectedModel = undefined;
    this.fillModels();
  }
}
