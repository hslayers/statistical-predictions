import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import Papa from 'papaparse';
import {
  HsConfig,
  HsDialogContainerService,
  HsUploadComponent,
  HsUploadedFiles,
} from 'hslayers-ng';

import {ColumnAlias, HsStatisticsService, Usage} from '../statistics.service';
import {HsStatisticsMapControllerComponent} from '../hs-statistics-map-controller/hs-statistics-map-controller.component';
import {HsStatisticsMapControllerDialogComponent} from '../hs-statistics-map-controller-dialog/hs-statistics-map-controller-dialog.component';

export const Frequencies = ['day', 'week', 'month', 'quarter', 'year'];
export const Formats = [
  'YYYY',
  'YYYY-MM',
  'YYYY-MM-dd',
  'dd-MM-YYYY',
  'MM-YYYY',
];
@Component({
  selector: 'hs-statistics-upload-panel',
  templateUrl: './hs-statistics-upload-panel.component.html',
})
export class HsStatisticsUploadPanelComponent implements AfterViewInit, OnInit {
  @Input() app = 'default';
  @Input() mapControllerComponent?: HsStatisticsMapControllerComponent;
  @Input() dialogMode = false;
  public title = '';
  columns: string[] = [];
  uses: Usage = null;
  columnAliases: ColumnAlias = null;
  originalRows: any[] = [];
  filteredRows: any[] = [];
  rowsCollapsed = false;
  records: any[] = [];
  fileInput;
  limitShown = 50;
  timeFrequencies: string[] = Frequencies;
  timeFormats: string[] = Formats;
  @ViewChild(HsUploadComponent) hsUploadComponent: HsUploadComponent;
  timeFrequency: string;
  timeFormat: string;
  uniqueValues: Map<string, string[]> = new Map();
  dimensionFilters: Map<string, string> = new Map();
  constructor(
    public hsStatisticsService: HsStatisticsService,
    public hsConfig: HsConfig,
    private hsDialogContainerService: HsDialogContainerService
  ) {
    this.hsStatisticsService.get(this.app).clearData$.subscribe(() => {
      this.resetData();
    });
  }
  ngOnInit(): void {
    const statisticsAppRef = this.hsStatisticsService.get(this.app);
    statisticsAppRef.corpus.timeFormat
      ? (this.timeFormat = statisticsAppRef.corpus?.timeFormat)
      : (this.timeFormat = 'YYYY');
    statisticsAppRef.corpus.timeFrequency
      ? (this.timeFrequency = statisticsAppRef.corpus?.timeFrequency)
      : (this.timeFrequency = 'year');
  }
  private resetData(): void {
    this.originalRows = [];
    this.filteredRows = [];
    this.columns = [];
    this.uses = {};
    this.columnAliases = {};
    this.rowsCollapsed = false;
    if (this.fileInput?.nativeElement?.value) {
      this.fileInput.nativeElement.value = '';
    }
    this.timeFrequency = 'year';
    this.timeFormat = 'YYYY';
  }

  ngAfterViewInit(): void {
    this.fileInput = this.hsUploadComponent.getFileInput();
  }

  visualizeInMap(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsMapControllerDialogComponent,
        {
          rows: this.filteredRows,
          columns: this.columns,
          uses: this.uses,
          app: this.app,
        },
        this.app
      );
    } else {
      this.hsStatisticsService.scroll(this.mapControllerComponent?.elementRef);
    }
  }

  dataAvailable(): boolean {
    return this.columns?.length > 0 && this.originalRows?.length > 0;
  }

  handleFileUpload(evt: HsUploadedFiles): void {
    const files = Array.from(evt.fileList);
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file);
      });
    });
    Promise.all(promises).then(async (fileContents) => {
      if (!fileContents) {
        console.error('Something went wrong');
        return;
      }
      this.records = [];
      Papa.parse(fileContents[0] as string, {
        header: true,
        skipEmptyLines: true,
        step: this.trimEmptyCells,
      });
      this.columns = Object.keys(this.records[0]);
      this.originalRows = this.records;
      this.filteredRows = this.records;
      this.setDefaultUses();
    });
  }

  trimEmptyCells = (results: Papa.ParseResult) => {
    Object.keys(results.data).forEach((k) => {
      if (results.data[k] === '') {
        delete results.data[k];
      }
    });
    this.records.push(results.data);
  };
  setDefaultUses(): void {
    if (!this.columns) {
      return;
    }
    this.uses = {};
    this.columnAliases = {};
    this.columns.map((key) => {
      this.dimensionFilters[key] = null;
      const allValues = this.filteredRows.map((r) => r[key]);
      this.uniqueValues[key] = allValues.filter(
        (v, i, a) => a.indexOf(v) === i
      );
      if (this.uniqueValues[key].length == 1) {
        this.uses[key] = 'ignore';
        this.dimensionFilters[key] = this.uniqueValues[key][0]; //In case 'dimension' usage will be selected later
        return;
      }
      const isNumeric = (num) => !isNaN(num);

      switch (key) {
        case 'Novads':
        case 'Pagasts':
        case 'Pašvaldība':
        case 'Municipality':
        case 'geo':
        case 'Field':
        case 'Municipality name or code':
        case 'AdministrativiTeritorialasVienibasNosaukums':
          this.uses[key] = 'location';
          break;
        case 'Gads':
        case 'Datums':
        case 'Year':
        case 'Month':
        case 'TIME_PERIOD':
        case 'Date':
          this.uses[key] = 'time';
          break;
        default:
          if (isNumeric(allValues[0])) {
            this.uses[key] = 'variable';
          } else {
            this.uses[key] = 'dimension';
          }
      }
      if (this.uses[key] == 'variable') {
        this.columnAliases[key] = key;
      }
    });
  }

  rowsShown(action: string): void {
    switch (action) {
      case 'more':
        this.limitShown += 50;
        break;
      case 'less':
        if (this.limitShown - 50 == 0) {
          this.limitShown = 50;
        } else {
          this.limitShown -= 50;
        }
        break;
      default:
        this.limitShown = 50;
    }
  }

  store(): void {
    const storageConf = {
      rows: this.filteredRows.map((r) => r), //Clone
      columns: this.columns,
      columnAliases: this.columnAliases,
      uses: this.uses,
      app: this.app,
      dimensionFilters: this.dimensionFilters,
    };
    this.hsStatisticsService.store(storageConf);
  }

  updateTime(): void {
    const statisticsAppRef = this.hsStatisticsService.get(this.app);
    statisticsAppRef.corpus.timeFrequency = this.timeFrequency;
    statisticsAppRef.corpus.timeFormat = this.timeFormat;
  }

  getUseType(col: string): string {
    switch (true) {
      case this.uses[col] === 'variable':
        return 'variable';
      case this.uses[col] === 'time':
        return 'time';
      case this.uses[col] === 'dimension':
        return 'dimension';
      default:
        return 'other';
    }
  }

  refreshTable(): void {
    this.filteredRows = this.hsStatisticsService.filterRowsByDimension(
      this.uses,
      this.originalRows,
      this.dimensionFilters
    );
  }
}
