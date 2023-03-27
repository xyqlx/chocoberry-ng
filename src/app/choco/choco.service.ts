import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChocoService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}
  async getAsync(route: string) {
    return await firstValueFrom(this.http.get(this.base + route));
  }
  async postAsync(route: string, data: any) {
    return await firstValueFrom(this.http.post(this.base + route, data));
  }
  async deleteAsync(route: string) {
    return await firstValueFrom(this.http.delete(this.base + route));
  }
  async findProcess(pid: number) {
    return await this.getAsync('process/' + pid);
  }
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.base}upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }
}
