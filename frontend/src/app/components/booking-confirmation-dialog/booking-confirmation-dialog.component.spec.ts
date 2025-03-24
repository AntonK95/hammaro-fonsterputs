import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmationDialogComponent } from './booking-confirmation-dialog.component';

describe('BookingConfirmationDialogComponent', () => {
  let component: BookingConfirmationDialogComponent;
  let fixture: ComponentFixture<BookingConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
