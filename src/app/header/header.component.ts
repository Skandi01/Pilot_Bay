import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { StorageService } from '../services/storage/storage.service';
import { Injectable } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgIf, LogoutComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isLogin: boolean = false;
  isPilot: boolean = false;
  isBrowser: boolean = false;
  //localStorage: any;

  constructor(private storageService: StorageService, @Inject(PLATFORM_ID) private platformId: Object) {
    //this.localStorage = localStorage;
  }

  ngOnInit(){
    this.checkUserType();
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
