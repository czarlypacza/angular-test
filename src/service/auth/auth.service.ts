import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloakTokenUrl = 'https://mk.test.com:8443/realms/test/protocol/openid-connect/token';
  private keycloakLogoutUrl = 'https://mk.test.com:8443/realms/test/protocol/openid-connect/logout';
  private keycloakUserInfoUrl = 'https://mk.test.com:8443/realms/test/protocol/openid-connect/userinfo';
  private clientId = 'angular-client';
  private clientSecret = 'CAvMec7oKki4YG23ddqdRoq715DEOi5x';

  constructor(private http: HttpClient) {}

  redirectToLogin() {
    const keycloakAuthUrl = 'https://mk.test.com:8443/realms/test/protocol/openid-connect/auth';
    const loginUrl = `${keycloakAuthUrl}?client_id=${this.clientId}&response_type=code`;
    window.location.href = loginUrl;
  }

  getAuthorizationCode(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  }

  exchangeCodeForToken(code: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);
    body.set('grant_type', 'authorization_code');
    body.set('code', code);

    return this.http.post(this.keycloakTokenUrl, body.toString(), { headers });
  }

  logout() {
    const logoutUrl = `${this.keycloakLogoutUrl}?client_id=${this.clientId}`;
    localStorage.removeItem('token');
    window.location.href = logoutUrl;
  }

  getUserInfo(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);

    return this.http.post(this.keycloakUserInfoUrl, body.toString(), { headers });
  }
}
