import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-authorise',
  standalone: true,
  imports: [],
  template: `<p>authorise works!</p>`,
  styleUrl: './authorise.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthoriseComponent { }
