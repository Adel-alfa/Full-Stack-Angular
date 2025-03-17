import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiServiceResponse } from '../interfaces/api-service-response';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = environment.apiUrl;
   
  constructor(private http:HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}product`);
  };
  addProduct(product: Product): Observable<ApiServiceResponse<number>> {
    return this.http.post<ApiServiceResponse<number>>(`${this.apiUrl}product`, product);
  }
 
}
