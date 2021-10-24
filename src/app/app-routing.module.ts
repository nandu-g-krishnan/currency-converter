import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/shared/auth.gaurd';
import { ConverterComponent } from './converter/converter.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';


const routes: Routes = [{ path: '', redirectTo: '/sign-in', pathMatch: 'full'},
{ path: 'sign-in', component: SignInComponent},
 { path: 'register-user', component: SignUpComponent},
 { path: 'converter', component: ConverterComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
