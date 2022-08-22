import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewRef,
} from '@angular/core';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {HsLayerUtilsService} from 'hslayers-ng';

import {
  CorpusItemValues,
  HsStatisticsService,
  Usage,
} from '../statistics.service';

dayjs.extend(utc);
/**
 * Dialog window to choose variables and filters to visualize data on map.
 * Can be used both for uploaded, but not yet stored data or
 * data from stored corpus.
 */
@Component({
  selector: 'hs-statistics-time-series',
  templateUrl: './hs-statistics-time-series.component.html',
})
export class HsStatisticsTimeSeriesComponent implements OnInit {
  @Input() data?: {
    rows: any[] | {[key: string]: {values: CorpusItemValues}};
    columns: string[];
    uses: Usage;
    app: string;
  };
  @Input() app? = 'default';
  @Input() dialogMode = false;
  viewRef: ViewRef;
  selectedVariable: string;
  selectedLocation: any;
  timeValues: any[];
  timeColumn: string;
  filteredRows: any[];
  locationColumn: string;
  locationValues: string[];
  colWrappers: {checked: boolean; name: string}[];
  observations: {
    name: string;
    time: string | number;
    time_stamp: string | Date;
    value: null;
  }[];
  @Output() closed = new EventEmitter<void>();

  constructor(
    public hsLayerUtilsService: HsLayerUtilsService,
    private hsStatisticsService: HsStatisticsService,
    public elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.init();
    this.hsStatisticsService.variableChanges.subscribe(() => {
      this.clearData();
      this.fillDataFromService();
      this.init();
    });
  }

  private clearData(): void {
    this.selectedVariable = undefined;
    this.filteredRows = null;
    this.locationValues = [];
    this.colWrappers = [];
    this.selectedLocation = undefined;
    this.observations = [];
  }
  init() {
    let tmpTimeValues = [];
    let tmpLocValues = [];
    if (this.data == undefined) {
      this.fillDataFromService();
    }
    if (Array.isArray(this.data.rows)) {
      this.locationColumn = this.data.columns.find(
        (col) => this.data.uses[col] == 'location'
      );
      this.timeColumn = this.data.columns.find(
        (col) => this.data.uses[col] == 'time'
      );
      tmpTimeValues = this.data.rows
        .map((row) => row[this.timeColumn])
        .filter((value) => value != undefined);
      tmpLocValues = this.data.rows
        .map((row) => row[this.locationColumn])
        .filter((value) => value != undefined);
    } else {
      this.locationColumn = 'location';
      this.timeColumn = 'time';
      tmpTimeValues = Object.keys(this.data.rows)
        .map((key) => this.data.rows[key])
        .map((row) => row.time);
      tmpLocValues = Object.keys(this.data.rows)
        .map((key) => this.data.rows[key])
        .map((row) => row.location);
    }

    this.timeValues = tmpTimeValues.filter((value, index, self) => {
      //Return only unique items https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
      return self.indexOf(value) === index;
    });

    this.locationValues = tmpLocValues.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    this.colWrappers = this.data.columns.map((col) => {
      return {checked: true, name: col};
    });
  }

  private fillDataFromService() {
    const statisticsAppRef = this.hsStatisticsService.get(this.app);
    this.data = {
      rows: statisticsAppRef.corpus.dict,
      columns: statisticsAppRef.corpus.variables,
      uses: statisticsAppRef.corpus.uses,
      app: this.app,
    };
  }

  selectVariable(variable): void {
    this.selectedVariable = variable;
    this.applyFilters();
  }

  selectFilter(value: any): void {
    this.selectedLocation = value;
    this.applyFilters();
  }

  applyFilters() {
    if (Array.isArray(this.data.rows)) {
      this.filteredRows = this.data.rows
        .filter((row) => row[this.locationColumn] == this.selectedLocation)
        .map((row) => {
          return {
            values: row,
            location: row[this.locationColumn],
            time: row[this.timeColumn],
          };
        });
    } else {
      this.filteredRows = Object.keys(this.data.rows)
        .map((key) => this.data.rows[key])
        .filter((row) => row.location == this.selectedLocation);
    }
  }

  async visualize(): Promise<void> {
    if (!this.filteredRows) {
      return;
    }
    this.observations = this.colWrappers
      .filter((col) => col.checked)
      .reduce(
        (acc, col) =>
          acc.concat(
            this.filteredRows?.map((s) => {
              const item = {
                value: s.values[col.name],
                name: col.name,
                time: s.time,
              };
              return item;
            })
          ),
        []
      );
  }

  close(): void {
    this.closed.emit();
  }
}
