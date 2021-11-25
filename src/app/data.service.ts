import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getData(request: any): Observable<any> {
    return this.http.post('http://7c9a-159-224-42-239.ngrok.io/production/processData', request);
  }

}
