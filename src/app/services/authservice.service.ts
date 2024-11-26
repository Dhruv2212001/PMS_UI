import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  baseUrl = environment.baseUrl
  constructor(private http: HttpClient) {}

    login(credentials: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.baseUrl}Auth/login`, credentials);
    }

    getPermission():Observable<any>{
      return this.http.get(`${this.baseUrl}Permission/get-permission`)
    }

    isAuthenticated(): boolean {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return !!token;
      }
      return false; // Default to false if localStorage is unavailable
    }

    logout() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }

    getUserInfo(){
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo;
    }


    changePassword(Data:any){
      return this.http.post(`${this.baseUrl}Auth/change-password`, Data);
    }


    getUserInfoById(Id:string){
      return this.http.get(`${this.baseUrl}Auth/get-user-id?userId=${Id}`)
    }
}
