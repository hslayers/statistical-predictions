import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsStatisticsToolbarComponent } from './hs-statistics-toolbar.component';

describe('HsStatisticsToolbarComponent', () => {
  let component: HsStatisticsToolbarComponent;
  let fixture: ComponentFixture<HsStatisticsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsStatisticsToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsStatisticsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
