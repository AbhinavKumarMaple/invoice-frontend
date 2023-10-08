import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedInvoiceComponent } from './generated-invoice.component';

describe('GeneratedInvoiceComponent', () => {
  let component: GeneratedInvoiceComponent;
  let fixture: ComponentFixture<GeneratedInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratedInvoiceComponent]
    });
    fixture = TestBed.createComponent(GeneratedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
