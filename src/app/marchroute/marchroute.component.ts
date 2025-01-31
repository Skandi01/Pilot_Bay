import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-marchroute',
  standalone: true,
  imports: [],
  template: `<p>marchroute works!</p>`,
  styleUrl: './marchroute.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarchrouteComponent { }
