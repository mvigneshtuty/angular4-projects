export class VoiceItUser {

    constructor(
        public userId: string,
        public password: string,
        public confirmPwd?: string,
        public name?: string
    ){ }
}