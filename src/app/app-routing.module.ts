import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AttendeeListComponent } from './attendee/attendee-list/attendee-list.component';


const routes: Routes = [
  { path:'', component: EventListComponent },
  { path:'create', component: EventCreateComponent , canActivate : [AuthGuard]},
  { path:'edit/:eventId', component: EventCreateComponent, canActivate : [AuthGuard] },
  { path:'attendees', component: AttendeeListComponent, canActivate : [AuthGuard] },
  { path: 'login', component : LoginComponent },
  { path: 'signup', component : SignupComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
