import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getProduct():Observable<any>{
    return this.http.get(`${this.baseUrl}Product`)
  }

  addProduct(formData: any):Observable<any>{
    return this.http.post(`${this.baseUrl}Product`, formData)
  }

  getProductById(id:any):Observable<any>{
    return this.http.get(`${this.baseUrl}Product/${id}`)
  }

  updateProduct(id: any, formData:any):Observable<any>{
    return this.http.put(`${this.baseUrl}Product/${id}`, formData)
  }

  deleteProduct(id: any):Observable<any>{
    return this.http.delete(`${this.baseUrl}Product/${id}`)
  }

  getProductExport(){
    return this.http.get(`${this.baseUrl}Product/export`,  { responseType: 'blob'})
  }

  ProductImport(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}Product/import`, formData);
  }

}
