import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPilotComponent } from './auth-pilot.component';

describe('AuthPilotComponent', () => {
  let component: AuthPilotComponent;
  let fixture: ComponentFixture<AuthPilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPilotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
