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
  private get(route: string){
    return this.http.get(this.base + route);
  }
  async getAsync(route: string){
    return await firstValueFrom(this.get(route));
  }
  async findProcess(pid: number){
    return await this.getAsync('process/' + pid);
  }
}
