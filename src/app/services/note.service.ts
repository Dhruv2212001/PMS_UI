import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  addNote(formData: any):Observable<any>{
    return this.http.post(`${this.baseUrl}Note`, formData)
  }

  getNotes():Observable<any>{
    return this.http.get(`${this.baseUrl}Note`)
  }

  editNote( id:any,formData: any,):Observable<any>{
    return this.http.put(`${this.baseUrl}Note/${id}`, formData)
  }

  getNoteByProductId(productId: any):Observable<any>{
    return this.http.get(`${this.baseUrl}Note/product/${productId}`)
  }

  deleteNote(noteId: number):Observable<any>{
    return this.http.delete(`${this.baseUrl}Note/${noteId}`)
  }

}
