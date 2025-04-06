import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LogoutMdComponent } from '../modals/logout_md/logout_md.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: `<button class="nav-link" routerLink="logout" routerLinkActive="active" (click)="openDialog()">Выйти</button>`,
  styleUrl: './logout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  constructor(private modalService: NgbModal) {}

  openDialog(): void {
    const modalRef = this.modalService.open(LogoutMdComponent);
  }

}
