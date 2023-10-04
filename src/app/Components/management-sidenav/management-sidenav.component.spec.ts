import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementSidenavComponent } from './management-sidenav.component';

describe('ManagementSidenavComponent', () => {
  let component: ManagementSidenavComponent;
  let fixture: ComponentFixture<ManagementSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementSidenavComponent]
    });
    fixture = TestBed.createComponent(ManagementSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
