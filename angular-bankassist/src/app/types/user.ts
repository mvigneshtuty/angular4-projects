export class User {
    id: string;
    name: string;
    password: string;

    constructor(user : User){
        this.id = user.id;
        this.name = user.name;
        this.password = this.password;
    }
}