import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = 'https://api.publicapis.org/categories';

  constructor(private http: HttpClient) {
  }

  getCategories(){
    return this.http.get<string[]>(this.url);
  }
}
