import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChocoService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) { }
  get(route: string){
    return this.http.get(this.base + route);
  }
  getGpu(){
    return this.get('gpu');
  }
}