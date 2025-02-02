import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { AuthPilotComponent } from './auth-pilot/auth-pilot.component';
import { AuthAirfieldComponent } from './auth-airfield/auth-airfield.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-authorise',
  standalone: true,
  imports: [AuthPilotComponent, AuthAirfieldComponent, FormsModule, NgIf],
  templateUrl: './authorise.component.html',
  styleUrl: './authorise.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthoriseComponent {
  radio: boolean = true;
  //radio2: boolean = false;
  
 }
