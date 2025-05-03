import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { StorageService } from '../services/storage/storage.service';
import { Injectable } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutMdComponent } from '../modals/logout_md/logout_md.component';
import { DataService } from '../services/data/data.service';
import { ISessionUser } from '../models/ISessionUser';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLogin: boolean = false;
  isPilot: boolean = false;
  isAirfield: boolean = false;
  isAdmin: boolean = false;
  activeUser: ISessionUser;
  //localStorage: any;

  constructor(private storageService: StorageService, @Inject(PLATFORM_ID) private platformId: Object, private modalService: NgbModal, private dataService: DataService) {
    this.activeUser = {
      userId: -1,
      userType: '',
      typeId: -1
    }
  }

  ngOnInit(){
    //this.checkUserType();
    if(!this.isLogin){
      this.dataService.data$.subscribe({
        next: (userStr) => {
          console.log('Инит хедера выполнен');
          this.activeUser = JSON.parse(userStr);
          if(this.activeUser.userType == '' && this.activeUser.userId == -1){
            this.isLogin = false;
            this.isPilot = false;
          }
          else if(this.activeUser.userType == 'pilot'){
            this.isLogin = true;
            this.isPilot = true;
          }
          else if(this.activeUser.userType == 'admin'){
            this.isLogin = true;
            this.isAdmin = true;
          }
          else if(this.activeUser.userType == 'airfield'){
            this.isLogin = true;
            this.isAirfield = true;
          }
        }
      });
    }
  }

  openLogoutDialog() {
    const modalRef = this.modalService.open(LogoutMdComponent);
  }

  checkUserType() {
    if (isPlatformBrowser(this.platformId)){
      const userId = localStorage.getItem('userId');
      if(userId == null || userId == undefined){
        this.isLogin = false;
      } else this.isLogin = true;
      const userType = localStorage.getItem('type');
      if(userId === 'pilot'){
        this.isPilot = true;
      } else this.isPilot = false;
    }
  }
 }
