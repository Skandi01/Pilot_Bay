import { ChangeDetectionStrategy, Component } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-logout-md',
  standalone: true,
  imports: [],
  templateUrl: './logout_md.component.html',
  styleUrl: './logout_md.component.css',
})
export class LogoutMdComponent { 
  constructor(public activeModal: NgbActiveModal, private storageService: StorageService, private router: Router, private dataService: DataService){}


  confirm(){
    console.log('Подтверждено');
    //this.storageService.clearLocalStorage();  // очистить локальное хранилище

    this.dataService.setActiveUser(-1,'',-1);

    this.activeModal.close(); // Закрываем модальное окно

    //Переход на главную страницу
    this.router.navigate(['']);
  }
}
