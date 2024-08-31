import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { JSONeditorComponent } from './jsoneditor/jsoneditor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JSONeditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front';
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const code = this.authService.getAuthorizationCode();
    if (code) {
      this.authService.exchangeCodeForToken(code).subscribe((response: any) => {
        localStorage.setItem('token', response.access_token);
        this.fetchUserInfo(response.access_token);
      });
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        this.fetchUserInfo(token);
      }
    }
  }

  login() {
    this.authService.redirectToLogin();
  }

  isLogged() {
    return !!localStorage.getItem('token');
  }

  logout() {
    this.authService.logout();
  }

  fetchUserInfo(token: string) {
    this.authService.getUserInfo(token).subscribe((userInfo: any) => {
      this.username = userInfo.preferred_username;
    });
  }

  protected readonly localStorage = localStorage;
}
