import { Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: TasksComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent }
];
