import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbComponent } from './fb.component';

describe('FbComponent', () => {
  let component: FbComponent;
  let fixture: ComponentFixture<FbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
