import { Injectable } from '@angular/core';
import { User } from '../domain/user';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  createNewUser(params: User): any{
    /** Params in JSON format */
    let jsonParams = {
      userId: params.userId,
      password: params.password
    }
    /** Invoking the http post request to Mock backend */
    return this.http.post('/api/create-user', JSON.stringify(jsonParams))
    .map(response => {
      console.log('create user response received from mock');
      let result = response.json();
      console.log('create user result', result);
      if(result.responseCode === 'SUC'){
        return true;
      }
      else{
        return false;
      }
    });
  }
}
