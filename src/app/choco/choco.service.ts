import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChocoService {
  private base = 'http://localhost:37373/';
  constructor(private http: HttpClient) { }
  get(route: string){
    return this.http.get(this.base + route);
  }
  getGpu(){
    return this.get('gpu');
  }
}
