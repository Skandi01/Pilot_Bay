import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logout-md',
  standalone: true,
  imports: [],
  templateUrl: './logout_md.component.html',
  styleUrl: './logout_md.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutMdComponent { 
  constructor(public activeModal: NgbActiveModal){}


  confirm(){
    console.log('Подтверждено');
    this.activeModal.close(); // Закрываем модальное окно
  }
}
