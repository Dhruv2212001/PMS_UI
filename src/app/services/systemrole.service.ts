import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SystemroleService {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getPermission():Observable<any>{
    return this.http.get(this.baseUrl +"Permission/get-permission")
  }
  createPermission(data:any):Observable<any>{
    return this.http.post(this.baseUrl +"Permission/create-Permission", data)
  }

  editPermission(permissionId, data:any):Observable<any>{
    return this.http.put(`${this.baseUrl}Permission/update-Permission/${permissionId}`, data)
  }

  getByPermissionId(id:any):Observable<any>{
    return this.http.get(`${this.baseUrl}Permission/get-Permission/${id}`)
  }

  deletePermission(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}Permission/delete-permission/${id}`)
  }



  getRoles():Observable<any>{
    return this.http.get(`${this.baseUrl}Role`)
  }

  createRole(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}Role/create-role`, data)
  }

  getRoleByName(roleName:any):Observable<any>{
    return this.http.get(`${this.baseUrl}Role/name/${roleName}`)
  }

  getPermissionsByRoleId(roleId:any):Observable<any>{
    return this.http.get(`${this.baseUrl}Role/permissions/${roleId}`)
  }


  editRole(RoleId, data:any):Observable<any>{
    return this.http.put(`${this.baseUrl}Role/update-role/${RoleId}`, data)
  }

  deleteRole(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}Role/delete-role/${id}`)
  }


  assignPermission(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}Permission/assign-permission`, data)
  }

  getPermissionNamesByRoleId(roleId:any):Observable<any>{
    return this.http.get(`${this.baseUrl}Role/permissions/${roleId}/permissionName`)
  }
}
