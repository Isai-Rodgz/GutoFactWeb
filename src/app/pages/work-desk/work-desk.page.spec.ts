import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkDeskPage } from './work-desk.page';

describe('WorkDeskPage', () => {
  let component: WorkDeskPage;
  let fixture: ComponentFixture<WorkDeskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkDeskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
