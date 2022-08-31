import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {HsCoreModule, HsDownloadModule, HsLanguageModule} from 'hslayers-ng';
import {HsLayoutModule} from 'hslayers-ng';
import {HsSearchModule} from 'hslayers-ng';
//import {HsMeasureModule} from 'hslayers-ng/components/measure/public-api';
//import {HsDrawModule} from 'hslayers-ng/components/draw/public-api';
import {HsLayerManagerModule, HsQueryModule, HsStylerModule} from 'hslayers-ng';
import {HsStatisticsHelpDialogComponent} from './help-dialog/help-dialog.component';
import {HsStatisticsModule} from '../lib/statistics.module';
import {HslayersAppComponent} from './app.component';
import {InfoDialogComponent} from './info.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    HslayersAppComponent,
    InfoDialogComponent,
    HsStatisticsHelpDialogComponent,
  ],
  imports: [
    BrowserModule,
    HsCoreModule,
    HsLanguageModule,
    HsLayoutModule,
    //HsDrawModule,
    //HsMeasureModule,
    HsSearchModule,
    //HsInfoModule,
    //HsGeolocationModule,
    HsQueryModule,
    HsLayerManagerModule,
    HsStylerModule,
    HsStatisticsModule,
    HsDownloadModule,
  ],
  providers: [],
  bootstrap: [HslayersAppComponent],
})
export class AppModule {}
