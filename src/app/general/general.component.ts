import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent { }
