import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetConfirmedBookingsComponent } from './get-confirmed-bookings.component';

describe('GetConfirmedBookingsComponent', () => {
  let component: GetConfirmedBookingsComponent;
  let fixture: ComponentFixture<GetConfirmedBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetConfirmedBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetConfirmedBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
