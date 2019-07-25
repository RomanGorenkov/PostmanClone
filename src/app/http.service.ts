import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService{

    constructor(private http: HttpClient){ }

    //http://localhost:60489/Home/PostUser  ASP.NET Core MVC
    //http://localhost:8080/angular/setUser.php     PHP

    postData(data: string){

        return this.http.post('http://localhost:60489/Home/PostUser', data);
    }
}
