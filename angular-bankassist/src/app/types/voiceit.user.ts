export class VoiceItUser {

    constructor(
        public userId: string,
        public name: string,
        public password: string,
        public confirmPwd?: string
    ){ }
}