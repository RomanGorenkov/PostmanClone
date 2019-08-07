import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService{

    constructor(private http: HttpClient){ }

    postData(data: string){
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      let options = {headers: headers};   
      return this.http.post('http://192.168.142.211:5000/api/list', JSON.parse(data), options);
    }
}
