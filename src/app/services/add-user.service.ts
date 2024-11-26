import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddUserService {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getUser():Observable<any>{
    return this.http.get(`${this.baseUrl}Auth/get-all-user`)
  }

  addUser(formData: any):Observable<any>{
    return this.http.post(`${this.baseUrl}Auth/user-register`, formData)
  }
  updateUser(userId:any,formData: any):Observable<any>{
    return this.http.put(`${this.baseUrl}Auth/${userId}`, formData)
  }

  getUserById(id:any):Observable<any>{
    return this.http.get(`${this.baseUrl}Auth/get-user-id/${id}`)
  }
  deleteUser(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}Auth/${id}`)
  }

}
