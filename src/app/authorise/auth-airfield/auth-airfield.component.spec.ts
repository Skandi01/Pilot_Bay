import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAirfieldComponent } from './auth-airfield.component';

describe('AuthAirfieldComponent', () => {
  let component: AuthAirfieldComponent;
  let fixture: ComponentFixture<AuthAirfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthAirfieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthAirfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
