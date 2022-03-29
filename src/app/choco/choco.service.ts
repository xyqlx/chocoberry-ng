import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from './../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChocoService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) { }
  async getAsync(route: string){
    return await firstValueFrom(this.http.get(this.base + route));
  }
  async postAsync(route: string, data: any){
    return await firstValueFrom(this.http.post(this.base + route, data));
  }
  async deleteAsync(route: string){
    return await firstValueFrom(this.http.delete(this.base + route));
  }
  async findProcess(pid: number){
    return await this.getAsync('process/' + pid);
  }
}
