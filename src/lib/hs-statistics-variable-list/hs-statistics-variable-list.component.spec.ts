import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsStatisticsVariableListComponent } from './hs-statistics-variable-list.component';

describe('HsStatisticsVariableListComponent', () => {
  let component: HsStatisticsVariableListComponent;
  let fixture: ComponentFixture<HsStatisticsVariableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsStatisticsVariableListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsStatisticsVariableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
