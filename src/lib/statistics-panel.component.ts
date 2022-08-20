import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {
  HsConfig,
  HsLayoutService,
  HsPanelBaseComponent,
  HsSidebarService,
} from 'hslayers-ng';
import {HsStatisticsService} from './statistics.service';

@Component({
  selector: 'hs-statistics',
  templateUrl: './statistics-panel.component.html',
  styleUrls: ['../styles.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class HsStatisticsPanelComponent
  extends HsPanelBaseComponent
  implements OnInit {
  public title = '';
  name = 'statistics';
  appRef;
  constructor(
    private hsStatisticsService: HsStatisticsService,
    hsLayoutService: HsLayoutService,
    private hsSidebarService: HsSidebarService,
  ) {
    super(hsLayoutService);
  }

  ngOnInit() {
    this.hsSidebarService.addButton(
      {
        panel: 'statistics',
        module: 'hs.statistics',
        order: 10,
        fits: true,
        visible: true,
        title: 'PANEL_HEADER.STATISTICS',
        description: 'SIDEBAR.descriptions.STATISTICS',
        icon: 'statistics-icon-barchartasc',
      },
      this.data.app
    );
    this.hsStatisticsService.init(this.data.app);
    this.appRef = this.hsStatisticsService.get(this.data.app);
  }
}
