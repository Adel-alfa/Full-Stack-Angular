import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { ApiServiceResponse } from '../interfaces/api-service-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
   apiUrl: string = environment.apiUrl;
   
  constructor(private http:HttpClient) { }

  getAllCategories(): Observable<ApiServiceResponse<Category[]>> {
    return this.http.get<ApiServiceResponse<Category[]>>(`${this.apiUrl}category`);
  };
  addCategory(category: Category): Observable<ApiServiceResponse<Category>> {
    return this.http.post<ApiServiceResponse<Category>>(`${this.apiUrl}category`, category);
  };
  updateCategory(category: Category): Observable<ApiServiceResponse<number>> {
    return this.http.put<ApiServiceResponse<number>>(`${this.apiUrl}/${category.id}`, category);
  }

}
