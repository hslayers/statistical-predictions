import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsStatisticsVariableTaggerComponent } from './hs-statistics-variable-tagger.component';

describe('HsStatisticsVariableTaggerComponent', () => {
  let component: HsStatisticsVariableTaggerComponent;
  let fixture: ComponentFixture<HsStatisticsVariableTaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsStatisticsVariableTaggerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsStatisticsVariableTaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
