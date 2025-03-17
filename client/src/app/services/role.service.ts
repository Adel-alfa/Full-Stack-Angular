import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Role } from '../interfaces/role';
import { Observable } from 'rxjs';
import { RoleCreateRequest } from '../interfaces/role-create-request';
import { UpdateUserRole } from '../interfaces/update-user-role';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  apiUrl: string = environment.apiUrl;
   
  constructor(private http:HttpClient) { }
  
  getRoles =(): Observable<Role[]>=>
    this.http.get<Role[]>(`${this.apiUrl}roles`);

  createRole =(role:RoleCreateRequest): Observable<{message:string}>=>
    this.http.post<{message:string}>(`${this.apiUrl}roles`,role);

  deleteRole =(id:string): Observable<{message:string}>=>
    this.http.delete<{message:string}>(`${this.apiUrl}roles/${id}`);

  assignRole =(userId:string,roleId:string): Observable<{message:string}>=>
    this.http.post<{message:string}>(`${this.apiUrl}roles/assign`,{
      userId,
      roleId,
    });

    updateRole =(data:UpdateUserRole): Observable<{message:string}>=>
      this.http.post<{message:string}>(`${this.apiUrl}roles/update-roles`,data);
}
