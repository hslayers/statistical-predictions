import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HsStatisticsCorrelationsComponent} from './hs-statistics-correlations.component';

describe('HsStatisticsCorrelationsComponent', () => {
  let component: HsStatisticsCorrelationsComponent;
  let fixture: ComponentFixture<HsStatisticsCorrelationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HsStatisticsCorrelationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HsStatisticsCorrelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
