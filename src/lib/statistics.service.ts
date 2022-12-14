import colormap from 'colormap';
import dayjs from 'dayjs';
import {ElementRef, Injectable} from '@angular/core';

import {
  HsConfig,
  HsConfirmDialogComponent,
  HsDialogContainerService,
  HsLanguageService,
} from 'hslayers-ng';
import {Subject} from 'rxjs';
import {sampleCorrelation} from 'simple-statistics';

import {ColumnWrapper} from './column-wrapper.type';
import {HsErrorDialogComponent} from './error-dialog/error-dialog.component';

export interface Usage {
  [key: string]: 'location' | 'ignore' | 'time' | 'variable' | 'dimension';
}

export interface TimeConfigDict {
  [key: string]: {
    timeFrequency: 'day' | 'week' | 'month' | 'quarter' | 'year';
    timeFormat: string;
  };
}

export interface ColumnAlias {
  [key: string]: string;
}

export interface CorpusItemValues {
  [key: string]: number;
}

export interface ShiftBy {
  [key: string]: number;
}

export interface CorpusDict {
  [key: string]: {values: CorpusItemValues; location?: string; time?: string};
}

export interface CorpusItems {
  dict: CorpusDict;
  variables: string[];
  uses: Usage;
  timeConfig: TimeConfigDict;
}

export type Prediction = {
  name: string;
  type: 'linear' | 'multi-linear';
  predictedVariable: string;
  coefficients: any;
  variables: ColumnWrapper[];
};

export class StatisticsServiceParams {
  /** Main hash table of time+location keys and values which are populated from columns marked as 'variable'*/
  corpus: CorpusItems = {
    dict: {},
    variables: [],
    uses: {},
    timeConfig: {},
  };
  clearData$: Subject<void> = new Subject();
  activeTab = 1;
  predictions: Prediction[] = [];
}

export type StorageConf = {
  rows: any[];
  columns: string[];
  columnAliases: ColumnAlias;
  uses: Usage;
  dimensionFilters: Map<string, string>;
  timeConfig: TimeConfigDict;
  app: string;
};

@Injectable({
  providedIn: 'root',
})
export class HsStatisticsService {
  apps: {
    [id: string]: StatisticsServiceParams;
  } = {default: new StatisticsServiceParams()};
  correlations: {
    matrix: {[var1: string]: number[]};
    list: {
      var1: string;
      var2: string;
      coefficient: number;
    }[];
  };
  variableChanges = new Subject<void>();
  predictionsAdded = new Subject<Prediction>();
  constructor(
    public hsLanguageService: HsLanguageService,
    public hsDialogContainerService: HsDialogContainerService,
    private hsConfig: HsConfig
  ) {}

  /**
   * Initialize the map swipe service data and subscribers
   * @param app - App identifier
   */
  init(app: string = 'default') {
    const savedCorpus = localStorage.getItem('hs_statistics_corpus');
    if (savedCorpus) {
      this.get(app).corpus = JSON.parse(savedCorpus);
    }
    const savedPredictions = localStorage.getItem('hs_statistics_predictions');
    if (savedPredictions) {
      this.get(app).predictions = JSON.parse(savedPredictions);
    }
    this.afterVariablesChange(app);
    this.setConfig(app);
  }

  afterVariablesChange(app: string) {
    this.correlations = this.correlate({}, app);
    this.variableChanges.next();
  }

  /**
   * Get the params saved by the statistics service for the current app
   * @param app - App identifier
   */
  get(app: string): StatisticsServiceParams {
    if (this.apps[app ?? 'default'] == undefined) {
      this.apps[app ?? 'default'] = new StatisticsServiceParams();
    }
    return this.apps[app ?? 'default'];
  }

  clone(observations) {
    return observations.map((o) => {
      const tmp = {};
      Object.assign(tmp, o);
      return tmp;
    });
  }

  store({
    rows,
    columns,
    columnAliases,
    uses,
    timeConfig,
    app,
  }: StorageConf): void {
    let duplicateFound = false;
    const appRef = this.get(app);
    const tmpCorpus: CorpusItems = {
      dict: Object.assign({}, appRef.corpus.dict),
      variables: [...appRef.corpus.variables],
      uses: Object.assign({}, appRef.corpus.uses),
      timeConfig: Object.assign({}, appRef.corpus.timeConfig),
    };

    if (!rows || !columns) {
      return;
    }
    const timeColumn = Object.keys(uses).find(
      (useCol) => uses[useCol] == 'time'
    );
    for (const row of rows) {
      /** Example '2010Kentucky' */
      /** Used to later filter records by location/time since key string is hard to
       * use if only location is provided and not time or vice versa */
      const keyObject = {location: undefined, time: undefined};
      for (const col of columns.filter((col) =>
        ['location', 'time'].includes(uses[col])
      )) {
        keyObject[uses[col]] = row[col];
      }
      let corpusItem: {values: CorpusItemValues};
      const key = keyObject.location + '::' + keyObject.time;
      if (tmpCorpus.dict[key] === undefined) {
        corpusItem = {values: {}, ...keyObject};
        tmpCorpus.dict[key] = corpusItem;
      } else {
        corpusItem = tmpCorpus.dict[key];
      }
      for (const col of columns.filter((col) => uses[col] == 'variable')) {
        const colName = columnAliases[col];
        //Why is this here? It breaks key comparisons between columns and usages
        //Answer: Its needed because vega treats everything after dot as a hierarchical sub-variable
        const escapedCol = colName?.replace(/\./g, '');
        if (corpusItem.values[escapedCol] !== undefined) {
          duplicateFound = true;
          this.callErrorDialog(
            {
              header: 'ERROR_DIALOG.DUPLICATE_DATA_ENTRY',
              errorMessage: 'ERROR_DIALOG.MORE_THEN_ONE_ENTRY_WAS_FOUND',
            },
            {location: key, value: row[col]},
            app
          );
          break;
        }
        corpusItem.values[escapedCol] = parseFloat(row[col]);
        if (!tmpCorpus.variables.some((v) => v == escapedCol)) {
          tmpCorpus.variables.push(escapedCol);
          tmpCorpus.timeConfig[escapedCol] = timeConfig[timeColumn]; //Time config is actually assigned to variable because we need to frequency to be used to visualize it
        }
        if (escapedCol != col) {
          uses[escapedCol] = uses[col];
        }
      }
      if (duplicateFound) {
        return;
      }
    }
    if (!duplicateFound) {
      Object.assign(appRef.corpus, tmpCorpus);
      Object.assign(appRef.corpus.uses, uses);
      this.save(app);
      this.afterVariablesChange(app);
    }
  }

  filterRowsByDimension(
    uses: Usage,
    rows: any[],
    dimensionFilters: Map<string, string>
  ): any[] {
    const filtersApplicable = Object.keys(uses)
      .filter((u) => uses[u] == 'dimension' && dimensionFilters[u])
      .map((col) => {
        return {col, value: dimensionFilters[col]};
      });
    if (filtersApplicable.length > 0) {
      rows = rows.filter((r) => {
        /*Look through rows and count how many columns have values 
        specified in filtersApplicable array. If all filters match then include this row */
        return (
          filtersApplicable.filter((f) => r[f.col] == f.value).length ==
          filtersApplicable.length
        );
      });
    }
    return rows;
  }

  save(app: string) {
    const appRef: StatisticsServiceParams = this.get(app);
    try {
      localStorage.setItem(
        'hs_statistics_corpus',
        JSON.stringify(appRef.corpus)
      );
    } catch (error) {
      this.callErrorDialog(
        {
          header: 'ERROR_DIALOG.ERROR_STORING_DATA',
          errorMessage: error.message,
        },
        undefined,
        app
      );
    }
  }

  addPrediction(
    app: string,
    name: string,
    type: 'linear' | 'multi-linear',
    coefficients: any,
    predictedVariable: string,
    variables: ColumnWrapper[]
  ) {
    const appRef = this.get(app);
    if (type == 'linear') {
      coefficients = {
        constant: variables[0].regressionOutput.b,
        variables: [
          {
            coefficient: variables[0].regressionOutput.m,
            factorName: 'X',
            name: variables[0].name,
          },
        ],
      };
    }
    const newPrediction = {
      name,
      type,
      predictedVariable,
      coefficients,
      variables,
    };
    appRef.predictions.push(newPrediction);
    localStorage.setItem(
      'hs_statistics_predictions',
      JSON.stringify(appRef.predictions)
    );
    this.predictionsAdded.next(newPrediction);
  }

  removeModel(prediction: Prediction, app: string = 'default') {
    const appRef = this.get(app);
    appRef.predictions.splice(appRef.predictions.indexOf(prediction), 1);
    localStorage.setItem(
      'hs_statistics_predictions',
      JSON.stringify(appRef.predictions)
    );
  }

  correlate(
    variableShifts: ShiftBy,
    app: string
  ): {
    matrix: {
      [var1: string]: number[];
    };
    list: {
      var1: string;
      var2: string;
      coefficient: number;
    }[];
  } {
    const appRef = this.get(app);
    const results = {matrix: {}, list: []};
    const colors = colormap({
      colormap: 'picnic',
      nshades: 20,
      format: 'hex',
      alpha: 1,
    });
    for (const var1 of appRef.corpus.variables) {
      results.matrix[var1] = [];
      for (const var2 of appRef.corpus.variables) {
        const {samples} = this.createShiftedSamples(
          [var1, var2],
          variableShifts,
          app
        );
        const coefficient =
          samples[0].length > 1 ? sampleCorrelation(samples[0], samples[1]) : 0;
        const color = colors[Math.round(((coefficient + 1) / 2) * 19)];
        results.matrix[var1].push({var2, coefficient, color});

        if (var1 !== var2) {
          results.list.push({
            shift: variableShifts[var1] ?? 0,
            samplePairs: samples[0].length,
            var1,
            var2,
            coefficient,
            color,
          });
        }
      }
    }
    Object.keys(results.matrix).map(
      (var1) =>
        (results.matrix[var1] = results.matrix[var1].sort((a, b) =>
          b.var2 > a.var2 ? -1 : 1
        ))
    );
    return results;
  }

  createShiftedSamples(
    variables: string[],
    variableShifts: ShiftBy,
    app: string
  ): {samples: number[][]; sampleKeys: string[][]} {
    const corpus = this.get(app).corpus;
    const dict = corpus.dict;
    const tmpSamples = variables.map((variable) => {
      const keys = Object.keys(dict).map((key) =>
        this.adjustDictionaryKey(
          this.get(app).corpus.dict,
          key,
          variable,
          variableShifts,
          corpus.timeConfig[variable].timeFormat,
          corpus.timeConfig[variable].timeFrequency
        )
      );
      return {
        values: keys.map((key) =>
          dict[key] ? dict[key].values[variable] : undefined
        ),
        keys,
      };
    });

    const samples = variables.map((_) => []);
    const sampleKeys = variables.map((_) => []);
    for (let i = 0; i < tmpSamples[0].values.length; i++) {
      if (
        tmpSamples.some(
          (sample) =>
            sample.values[i] === null ||
            sample.values[i] === undefined ||
            isNaN[sample.values[i]]
        )
      ) {
        continue;
      } else {
        for (let varIx = 0; varIx < variables.length; varIx++) {
          samples[varIx].push(tmpSamples[varIx].values[i]);
          sampleKeys[varIx].push(tmpSamples[varIx].keys[i]);
        }
      }
    }
    return {samples, sampleKeys};
  }

  /**
   * Take data dictionary item key and return the same item, but from another time frequency
   * @param dict -
   * @param key -
   * @param variable -
   * @param variableShifts -
   * @returns
   */
  adjustDictionaryKey(
    dict: CorpusDict,
    key: string,
    variable: string,
    variableShifts: ShiftBy,
    format: string,
    frequency: 'year' | 'month' | 'quarter' | 'day' | 'week'
  ): string {
    const origEntry = dict[key];
    return (
      origEntry.location +
      '::' +
      this.shiftTime(
        variable,
        origEntry.time,
        variableShifts,
        format,
        frequency
      )
    );
  }

  /**
   * Lookup time shifting amount
   * @param variable -
   * @param time -
   * @returns
   */
  shiftTime(
    variable: string,
    time: string,
    variableShifts: ShiftBy,
    timeFormat: string,
    timeFrequency: 'year' | 'month' | 'quarter' | 'day' | 'week'
  ): string {
    let tmpDate = dayjs(time);
    if (timeFrequency == 'quarter') {
      tmpDate = tmpDate.add(variableShifts[variable] * 3 ?? 0, 'month');
    } else {
      tmpDate = tmpDate.add(variableShifts[variable] ?? 0, timeFrequency);
    }
    return tmpDate.format(timeFormat);
  }

  async clear(app: string, forceClear?: boolean): Promise<void> {
    const appRef = this.get(app);
    let confirmed: string;
    if (forceClear !== undefined && forceClear === true) {
      confirmed = 'yes';
    } else {
      const dialog = this.hsDialogContainerService.create(
        HsConfirmDialogComponent,
        {
          message: this.hsLanguageService.getTranslation(
            'STATISTICS.CLEAR_ALL_STATISTICS_DATA'
          ),
          title: this.hsLanguageService.getTranslation('COMMON.confirm'),
        },
        app
      );
      confirmed = await dialog.waitResult();
    }
    if (confirmed == 'yes') {
      appRef.corpus.dict = {};
      appRef.corpus.variables = [];
      appRef.corpus.uses = {};
      appRef.corpus.timeConfig = {};
      localStorage.removeItem('hs_statistics_corpus');
      appRef.clearData$.next();
      this.afterVariablesChange(app);
    }
  }

  callErrorDialog(
    dialogOptions: {header: string; errorMessage?: string},
    params,
    app: string
  ): void {
    this.hsDialogContainerService.create(
      HsErrorDialogComponent,
      {
        header: this.hsLanguageService.getTranslation(dialogOptions.header),
        errorMessage: this.hsLanguageService.getTranslation(
          dialogOptions.errorMessage,
          params,
          app
        ),
      },
      app
    );
  }

  setConfig(app: string = 'default') {
    this.hsConfig.update(
      {
        panelWidths: {statistics: 600, 'statistics-upload': 700},
        translationOverrides: {
          en: {
            SIDEBAR: {
              descriptions: {
                UPLOAD: 'Upload tabular data',
                STATISTICS: 'Calculate statistics',
              },
            },
            PANEL_HEADER: {
              STATISTICS: 'Statistics',
              UPLOAD: 'Upload tabular data',
            },
            ERROR_DIALOG: {
              MISSING_LAYER: 'Missing layer for visualization',
              MAKE_SURE_YOU_HAVE:
                'Make sure You have selected layer before trying to visualize the data on the map!',
              ERROR_STORING_DATA: 'Error storing data to localStorage',
              DUPLICATE_DATA_ENTRY: 'Duplicate data entry',
              MORE_THEN_ONE_ENTRY_WAS_FOUND:
                'More then one data entry was found for {{location}} when storing value {{value}}. Set some of the columns as `Dimension` with corresponding filters to reduce dimensionality. Only one value must remain in `Variable` column for each Location-Time combination.',
            },
            STATISTICS: {
              HELP: 'Help',
              AGO: 'ago',
              BY: 'by',
              CLEAR_ALL_DATA: 'Clear all data',
              CLEAR_ALL_STATISTICS_DATA:
                'Do you really want to clear all statistics data?',
              COLLAPSE_ROWS: 'Collapse rows',
              CORRELATE: 'Correlate',
              CORRELATION_MATRIX: 'Correlation matrix',
              CORRELATIONS: 'Correlations',
              CURRENT_VARIABLES: 'Current variables',
              DESCRIPTIVE_STATISTICS: 'Descriptive statistics',
              FREQUENCY: 'Frequency',
              INTERVALS: 'Intervals',
              IN_SAME_CHART: 'Merge charts',
              LOCATION_FILTER: 'Location',
              MAXIMUM: 'Maximum',
              MEAN_ABSOLUTE_DEVIATION: 'Mean absolute deviation',
              MEAN: 'Mean',
              MEDIAN: 'Median',
              MINIMUM: 'Minimum',
              MODE: 'Mode',
              NUMBER_OF_STUDENTS: 'Number of students',
              PEARSONS_OFFSET_COEFFICIENT: "Pearson's offset coefficient",
              PREDICT: 'Predict',
              REGRESSION_TYPE: 'Type',
              REGRESSION: 'Regression',
              removeVariable: 'Remove variable',
              SHIFT: 'Shift',
              STANDARD_DEVIATION: 'Standard deviation',
              STORE: 'Store',
              TIME_FILTER: 'Filter by time',
              TIME_SERIES_CHART: 'Time series chart',
              TIMESTAMP: 'Timestamp',
              VALUE: 'Value',
              VARIABLE_LIST: 'Variable list',
              VARIABLE: 'Variable',
              VARIABLES: 'Variables',
              VARIANCE: 'Variance',
              VISUALIZE_MAP: 'To map',
              VISUALIZE: 'Visualize',
              YEARS: 'years',
              LOCATION_PROPERTY: 'Location attribute in map layer',
              DOWNLOAD_TEMPLATE_HINT: `Upload data in CSV format. A template can be downloaded`,
              HERE: 'here',
              OPTIONAL: '(optional)',
              PREDICTIONS: 'Predictions',
              FROM: 'From',
              TILL: 'Till',
              STORE_MODEL: 'Store model',
              MODEL_NAME: 'Model name',
              FUNCTION: 'Function',
              DRAG_TO_DRAW: 'Drag mouse in this area to draw',
              STORED_STATISTICAL_MODEL: 'Stored statistical model',
            },
          },
        },
      },
      app
    );
  }

  scroll(el: ElementRef) {
    el.nativeElement.scrollIntoView({behavior: 'smooth'});
  }
}
