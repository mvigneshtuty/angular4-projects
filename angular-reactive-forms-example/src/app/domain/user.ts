export class User {
    
    public userId: string;
    public password: string;
    public confirmPwd: string;
    public name: string;

    constructor(
        
    ) { }

    clear(){
        this.userId = '';
        this.password = '';
        this.confirmPwd = '';
        this.name = '';
    }
}