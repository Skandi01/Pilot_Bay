import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { MarchrouteComponent } from './marchroute/marchroute.component';
import { ForumComponent } from './forum/forum.component';
import { AboutComponent } from './about/about.component';
import { AuthoriseComponent } from './authorise/authorise.component';
import { ProfileComponent } from './profiles/profile/profile.component';
import { GeneralComponent } from './general/general.component';

export const routes: Routes = [
    { path: '', redirectTo: '/general', pathMatch: 'full' },
    { path: 'general', component: GeneralComponent },
    { path: 'flight_plan', component: MarchrouteComponent },
    { path: 'forum', component: ForumComponent },
    { path: 'login', component: LoginComponent },
    { path: 'authorise', component: AuthoriseComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'about', component: AboutComponent },
];
