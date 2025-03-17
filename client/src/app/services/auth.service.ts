import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetails } from '../interfaces/user-details';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';
import { UpdateUserStatus } from '../interfaces/update-user-status';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
apiUrl: string= environment.apiUrl;
private userKey = 'user';
  constructor(private http:HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }
          return response;
        })
      );
  }
  
  getToken = (): string | null =>{
    const user = localStorage.getItem(this.userKey);
    if(!user) return null;
    const userDetail:AuthResponse=JSON.parse(user);
    return userDetail.token;
  };

    isLoggedIn = (): boolean => {
      const token = this.getToken();
      if (!token) return false;     
      return true;
    };
    isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;   
    return true;
  }

    logout = (): void => {
      localStorage.removeItem(this.userKey);
    };
    
    getUserDetail = () => {
      const token = this.getToken();
      if (!token) return null;
      const decodedToken: any = jwtDecode(token);
      const userDetail = {
        id: decodedToken.nameid,
        fullName: decodedToken.name,
        email: decodedToken.email,
        roles: decodedToken.role || [],
      };
  
      return userDetail;
    };
    register(data: RegisterRequest): Observable<AuthResponse> {
      return this.http
        .post<AuthResponse>(`${this.apiUrl}account/register`, data);      
    };
    getDetails=():Observable<UserDetails> =>
      this.http.get<UserDetails>(`${this.apiUrl}account/details`);
    getUserDetailsById=(data:string):Observable<UserDetails> =>
      this.http.get<UserDetails>(`${this.apiUrl}account/getbyid/`+data);
    getAll = ():Observable<UserDetails[]> =>
      this.http.get<UserDetails[]>(`${this.apiUrl}account`); 

    getRoles = (): string[] | null => {
      const token = this.getToken(); 
      if (!token) return null;
  
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role || [];
    };
    forgotPasswordRequest(data: { email: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}account/forgot-password`, data);
    };
    resetPasswordRequest(data: ResetPasswordRequest): Observable<any> {
      return this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data);
    };
    changePasswordRequest(data: ChangePasswordRequest): Observable<any> {
      return this.http.post<AuthResponse>(`${this.apiUrl}account/change-password`, data);
    };
    refreshToken = (data: {
      email:string;
      token:string;
      refreshToken:string;
    }):Observable<AuthResponse> =>
      this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`,data);  
  
    getRefreshToken = (): string | null =>{
        const user = localStorage.getItem(this.userKey);
        if(!user) return null;
        const userDetail:AuthResponse=JSON.parse(user);
        return userDetail.refreshToken;
      };

    updateUserStatus(data:UpdateUserStatus):Observable<any>{
        return this.http.post(`${this.apiUrl}account/UpdateStatus`,data);
      };
}
