import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { MarchrouteComponent } from './marchroute/marchroute.component';
import { ForumComponent } from './chat/forum/forum.component';
import { AboutComponent } from './about/about.component';
import { AuthoriseComponent } from './authorise/authorise.component';
import { ProfileComponent } from './profiles/profile/profile.component';
import { GeneralComponent } from './general/general.component';
import { MarchrouteYMapsComponent } from './marchrouteYMaps/marchrouteYMaps.component';
import { ForumAirfieldComponent } from './chat/forum-airfield/forum-airfield.component';
import { AdministrationComponent } from './administration/administration.component';

export const routes: Routes = [
    { path: '', redirectTo: '/general', pathMatch: 'full' },
    { path: 'general', component: GeneralComponent },
    { path: 'flight_plan', component: MarchrouteYMapsComponent },
    { path: 'forum', component: ForumComponent },
    { path: 'forum_airfield', component: ForumAirfieldComponent },
    { path: 'login', component: LoginComponent },
    { path: 'authorise', component: AuthoriseComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'administration', component: AdministrationComponent },
    { path: 'about', component: AboutComponent },
];
