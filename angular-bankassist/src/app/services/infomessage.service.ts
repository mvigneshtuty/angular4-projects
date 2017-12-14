import { Injectable } from '@angular/core';

@Injectable()
export class InfomessageService {

  constructor() { }

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  replace(message: string){
    this.clear();
    this.add(message);
  }

  clear() {
    this.messages.length = 0;
  }
}
