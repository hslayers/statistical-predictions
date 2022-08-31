import {Component, ElementRef, Input, OnInit, ViewRef} from '@angular/core';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Geometry} from 'ol/geom';
import {
  HsDialogContainerService,
  HsLayerUtilsService,
  HsMapService,
  HsStylerService,
  HsUtilsService,
  getTitle,
  setSld,
} from 'hslayers-ng';
import {Layer} from 'ol/layer';
import {Source} from 'ol/source';
import {max, min} from 'simple-statistics';

import {
  CorpusItemValues,
  HsStatisticsService,
  Usage,
} from '../statistics.service';
import {HsStatisticsHistogramComponent} from '../histogram-chart-dialog.component';

/**
 * Dialog window to choose variables and filters to visualize data on map.
 * Can be used both for uploaded, but not yet stored data or
 * data from stored corpus.
 */
@Component({
  selector: 'hs-statistics-map-controller',
  templateUrl: './hs-statistics-map-controller.component.html',
})
export class HsStatisticsMapControllerComponent implements OnInit {
  @Input() data: {
    rows: any[] | {[key: string]: {values: CorpusItemValues}};
    columns: string[];
    uses: Usage;
    app: string;
  };
  @Input() dialogMode = false;
  viewRef: ViewRef;
  vectorLayers = [];
  selectedLayer: {
    layer: VectorLayer<VectorSource<Geometry>>;
    title: string;
  };
  availableVariables: string[] = [];
  selectedVariable: string;
  selectedTimeValue: any;
  timeValues: any[];
  timeColumn: string;
  min: number;
  max: number;
  filteredRows: any[];
  locationColumn: string;
  filteredValues: number[];
  locProperties: {[x: string]: any};
  selectedLocationProp: string;

  constructor(
    public hsDialogContainerService: HsDialogContainerService,
    public hsLayerUtilsService: HsLayerUtilsService,
    private hsMapService: HsMapService,
    private hsStylerService: HsStylerService,
    private hsStatisticsService: HsStatisticsService,
    private hsUtilsService: HsUtilsService,
    public elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.hsStatisticsService.variableChanges.subscribe(() => {
      this.resetData();
      this.init();
    });
    this.init();
  }

  private resetData(): void {
    this.availableVariables = [];
    this.filteredRows = null;
    this.timeValues = [];
    this.max = undefined;
    this.min = undefined;
    this.selectedLayer = undefined;
    this.selectedVariable = undefined;
    this.selectedTimeValue = undefined;
    this.selectedLocationProp = undefined;
    this.locProperties = undefined;
    this.selectedLocationProp = undefined;
  }

  private fillDataFromService(): void {
    const statisticsAppRef = this.hsStatisticsService.get(this.data.app);
    this.data = {
      rows: statisticsAppRef.corpus.dict,
      columns: statisticsAppRef.corpus.variables,
      uses: statisticsAppRef.corpus.uses,
      app: this.data.app,
    };
  }

  init(): void {
    this.fillDataFromService();
    if (this.isDataLoaded()) {
      if (Array.isArray(this.data.rows)) {
        this.locationColumn = this.data.columns.find(
          (col) => this.data.uses[col] == 'location'
        );
      } else {
        this.locationColumn = 'location';
      }
      this.availableVariables = this.data.columns.filter(
        (col) => this.data.uses[col] == 'variable'
      );
      this.selectedVariable = this.availableVariables[0];
      this.fillTimeValues();
      if (this.timeValues?.length > 0) {
        this.selectFilter(this.timeValues[this.timeValues.length - 1]);
      }
    }

    this.fillVectorLayers();
  }

  fillTimeValues(): void {
    if (this.isDataLoaded()) {
      let tmpTimeValues = [];
      if (Array.isArray(this.data.rows)) {
        this.timeColumn = this.data.columns.find(
          (col) => this.data.uses[col] == 'time'
        );
        tmpTimeValues = this.data.rows
          .filter((row) => {
            return (
              this.selectedVariable === undefined ||
              row[this.selectedVariable] !== undefined
            );
          })
          .map((row) => row[this.timeColumn])
          .filter((value) => value != undefined);
      } else {
        this.timeColumn = 'time';
        tmpTimeValues = Object.keys(this.data.rows)
          .filter((key) => {
            return (
              this.selectedVariable === undefined ||
              this.data.rows[key].values[this.selectedVariable] !== undefined
            );
          })
          .map((key) => this.data.rows[key])
          .map((row) => row.time);
      }

      this.timeValues = tmpTimeValues
        .filter((value, index, self) => {
          //Return only unique items https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
          return self.indexOf(value) === index;
        })
        .filter((val) => val);
    }
  }

  isDataLoaded(): boolean {
    if (
      Object.keys(this.data.rows)?.length > 0 &&
      this.data.columns?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  visualizeHistogram(): void {
    this.hsDialogContainerService.create(
      HsStatisticsHistogramComponent,
      {
        filteredValues: this.filteredValues,
        selectedTime: this.selectedTimeValue,
        min: this.min,
        max: this.max,
        selectedVariable: this.selectedVariable,
        app: this.data.app,
      },
      this.data.app
    );
  }

  async fillVectorLayers(): Promise<void> {
    this.hsMapService.loaded(this.data.app).then((map) => {
      this.vectorLayers = [
        ...this.hsMapService
          .getLayersArray(this.data.app)
          .filter(
            (layer: Layer<Source>) =>
              this.hsUtilsService.instOf(layer, VectorLayer) &&
              this.hsLayerUtilsService.isLayerInManager(layer) &&
              this.hsLayerUtilsService.hasLayerTitle(layer) &&
              this.hsLayerUtilsService.isLayerEditable(layer)
          )
          .map((layer: VectorLayer<VectorSource<Geometry>>) => {
            return {layer, title: getTitle(layer)};
          }),
      ];
      if (this.vectorLayers.length > 0) {
        this.selectLayer(this.vectorLayers[0]);
      }
    });
  }

  close(): void {
    this.hsDialogContainerService.destroy(this, this.data.app);
  }

  async selectLayer(layer: {
    layer: VectorLayer<VectorSource<Geometry>>;
    title: string;
  }): Promise<void> {
    this.selectedLayer = layer;
    this.selectedLayer.layer.setVisible(true);
    this.fillAttributes();
  }

  /**
   * Get possible attributes from first feature.
   * If no features exist, wait for them.
   */
  fillAttributes() {
    const src = this.selectedLayer.layer.getSource();
    const features = src.getFeatures();
    if (features.length == 0) {
      src.once('change', () => this.fillAttributes());
      return;
    }
    this.locProperties = Object.keys(features[0].getProperties());
  }

  histogramDisabled(): boolean {
    return (
      !this.filteredRows ||
      !this.selectedVariable ||
      !this.selectedTimeValue ||
      !(this.min >= 0 && this.max > 0)
    );
  }

  visualizeDisabled(): boolean {
    return (
      !this.filteredRows ||
      !this.filteredValues ||
      this.filteredValues?.length === 0
    );
  }

  selectVariable(variable): void {
    this.selectedVariable = variable;
    this.fillTimeValues();
    this.applyFilters();
  }

  selectFilter(value: any): void {
    this.selectedTimeValue = value;
    this.applyFilters();
  }

  applyFilters() {
    if (!this.selectedVariable) {
      return;
    }
    if (Array.isArray(this.data.rows)) {
      this.filteredRows = this.data.rows.filter(
        (row) => row[this.timeColumn] == this.selectedTimeValue
      );
      this.filteredValues = this.filteredRows
        .map((row) => parseFloat(row[this.selectedVariable]))
        .filter((value) => !isNaN(value));
    } else {
      this.filteredRows = Object.keys(this.data.rows)
        .map((key) => this.data.rows[key])
        .filter((row) => row.time == this.selectedTimeValue);
      this.filteredValues = this.filteredRows
        .map((row) => row.values)
        .map((row) => parseFloat(row[this.selectedVariable]))
        .filter((value) => !isNaN(value));
    }

    this.min = this.filteredValues?.length > 0 ? min(this.filteredValues) : 0;
    this.max = this.filteredValues?.length > 0 ? max(this.filteredValues) : 0;
  }

  async visualize(): Promise<void> {
    if (!this.selectedLayer) {
      this.hsStatisticsService.callErrorDialog(
        {
          header: 'ERROR_DIALOG.MISSING_LAYER',
          errorMessage: 'ERROR_DIALOG.MAKE_SURE_YOU_HAVE',
        },
        undefined,
        this.data.app
      );
      return;
    }
    if (!this.filteredRows) {
      return;
    }
    const features = this.selectedLayer.layer.getSource().getFeatures();
    for (const row of this.filteredRows) {
      const feature = features.find(
        (feature) =>
          feature.get(this.selectedLocationProp) == row[this.locationColumn]
      );
      if (feature) {
        feature.set(
          'value',
          parseFloat(
            Array.isArray(this.data.rows)
              ? row[this.selectedVariable]
              : row.values[this.selectedVariable]
          )
        );
      }
    }

    const rules = [];
    const palette = [
      '#a52344',
      '#ac2e35',
      '#af3d24',
      '#ad4e0d',
      '#a75e00',
      '#9c6e00',
      '#8d7d00',
      '#798c00',
      '#5f9900',
      '#35a523',
    ];
    const step = (this.max - this.min) / 10.0;
    for (let i = 0; i < 10; i++) {
      rules.push(`<Rule>
      <Name>class${i}</Name>
      <Filter xmlns="http://www.opengis.net/ogc">
        <And>
          <PropertyIsGreaterThanOrEqualTo>
            <PropertyName>value</PropertyName>
            <Literal>${this.min + step * i}</Literal>
          </PropertyIsGreaterThanOrEqualTo>
          <PropertyIsLessThan>
            <PropertyName>value</PropertyName>
            <Literal>${this.min + step * (i + 1)}</Literal>
          </PropertyIsLessThan>
        </And>
      </Filter>
      <PolygonSymbolizer>
        <Fill>
          <CssParameter name="fill">${palette[i]}</CssParameter>
          <CssParameter name="fill-opacity">1</CssParameter>
        </Fill>
        <Stroke>
          <CssParameter name="stroke">#000</CssParameter>
          <CssParameter name="stroke-opacity">0.25</CssParameter>
          <CssParameter name="stroke-width">0.5</CssParameter>
        </Stroke>
      </PolygonSymbolizer>
    </Rule>`);
    }
    const sld = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Default</Name>
    <UserStyle>
      <Name>Default</Name>
      <Title>Default</Title>
      <FeatureTypeStyle>
        ${rules.join()}
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;
    setSld(this.selectedLayer.layer, sld);
    const style = (await this.hsStylerService.parseStyle(sld, this.data.app))
      .style;
    if (style) {
      this.selectedLayer.layer.setStyle(style);
    }
    this.selectedLayer.layer.setVisible(true);
  }
}
