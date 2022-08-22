import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';

import Papa from 'papaparse';
import {
  HsConfig,
  HsDialogContainerService,
  HsUploadComponent,
  HsUploadedFiles,
} from 'hslayers-ng';

import {HsStatisticsMapControllerComponent} from '../hs-statistics-map-controller/hs-statistics-map-controller.component';
import {HsStatisticsMapControllerDialogComponent} from '../hs-statistics-map-controller-dialog/hs-statistics-map-controller-dialog.component';
import {HsStatisticsService, Usage} from '../statistics.service';

@Component({
  selector: 'hs-statistics-upload-panel',
  templateUrl: './hs-statistics-upload-panel.component.html',
})
export class HsStatisticsUploadPanelComponent implements AfterViewInit {
  @Input() app = 'default';
  @Input() mapControllerComponent?: HsStatisticsMapControllerComponent;
  @Input() dialogMode = false;
  public title = '';
  columns: string[] = [];
  uses: Usage = null;
  rows: any[] = [];
  rowsCollapsed = false;
  records: any[] = [];
  fileInput;
  limitShown = 50;
  @ViewChild(HsUploadComponent) hsUploadComponent: HsUploadComponent;
  downloadData: any;
  uploadTemplate = `"Municipality name or code",Year,"Variable 1","Variable 2"
  Alūksnes municipality,2010,1,1
  Cēsu municipality,2010,1,2`;

  constructor(
    public hsStatisticsService: HsStatisticsService,
    public hsConfig: HsConfig,
    private hsDialogContainerService: HsDialogContainerService
  ) {
    if (!this.rows && !this.columns) {
      const savedTable = localStorage.getItem('hs_statistics_table');
      if (savedTable) {
        this.rows = JSON.parse(savedTable).rows;
        this.columns = JSON.parse(savedTable).columns;
        this.setUses();
      }
    }
    this.hsStatisticsService.get(this.app).clearData$.subscribe(() => {
      this.rows = [];
      this.columns = [];
      this.uses = {};
      this.rowsCollapsed = false;
      if (this.fileInput?.nativeElement?.value) {
        this.fileInput.nativeElement.value = '';
      }
    });
  }
  ngAfterViewInit(): void {
    this.fileInput = this.hsUploadComponent.getFileInput();
  }

  visualizeInMap(): void {
    if (this.dialogMode) {
      this.hsDialogContainerService.create(
        HsStatisticsMapControllerDialogComponent,
        {
          rows: this.rows,
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
    return this.columns?.length > 0 && this.rows?.length > 0;
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
      Papa.parse(fileContents[0] as string, {
        header: true,
        skipEmptyLines: true,
        step: this.trimEmptyCells,
      });
      this.columns = Object.keys(this.records[0]);
      this.setUses();
      this.rows = this.records;
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
  setUses(): void {
    if (!this.columns) {
      return;
    }
    this.uses = {};
    this.columns.map((key) => {
      switch (key) {
        case 'Novads':
        case 'Pagasts':
        case 'Pašvaldība':
        case 'Municipality':
        case 'Field':
        case 'Municipality name or code':
        case 'AdministrativiTeritorialasVienibasNosaukums':
          this.uses[key] = 'location';
          break;
        case 'Gads':
        case 'Datums':
        case 'Year':
        case 'Month':
        case 'Date':
          this.uses[key] = 'time';
          break;
        default:
          this.uses[key] = 'variable';
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
}
