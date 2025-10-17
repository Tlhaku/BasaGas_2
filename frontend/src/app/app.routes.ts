import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { OrderPageComponent } from './pages/order/order-page.component';
import { PricingPageComponent } from './pages/pricing/pricing-page.component';
import { TrackPageComponent } from './pages/track/track-page.component';
import { LinkPhonePageComponent } from './pages/link-phone/link-phone-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VisitorCommentsComponent } from './pages/visitor-comments/visitor-comments.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'order', component: OrderPageComponent, canActivate: [authGuard] },
  { path: 'pricing', component: PricingPageComponent },
  { path: 'visitor-comments', component: VisitorCommentsComponent },
  { path: 'track', component: TrackPageComponent },
  { path: 'track/link-phone', component: LinkPhonePageComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: '**', redirectTo: '' }
];
