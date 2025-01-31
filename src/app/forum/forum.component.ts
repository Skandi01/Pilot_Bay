import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [],
  template: `<p>forum works!</p>`,
  styleUrl: './forum.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumComponent { }
