/* 
const Mailjs = require("@cemalgnlts/mailjs");

type CreateOneAccount = {
    username: string;
    password: string
}

type ILoginResult = {
    token: string;
    id: string
}
interface IMessageResult {
    id: string;
    accountId: string;
    msgid: string;
    from: {
        address: string;
        name: string;
    };
    to: {
        address: string;
        name: string;
    };
    subject: string;
    intro: string;
    seen: boolean;
    isDeleted: boolean;
    hasAttachments: boolean;
    size: number;
    downloadUrl: string;
    createdAt: string;
    updatedAt: string;
}
interface IMailAccount {
    username: string;
    password: string;
    token: string;
    accountId: string;
}

interface MailAccount {
    createAccount(): Promise<CreateOneAccount>;
    SignUpAccount(): Promise<ILoginResult>;
    getMessages(): Promise<IMessageResult[]>;
    getMessage(tokenId: string): Promise<IMessageResult>;
    get AccountCreds(): { username: string | null, password: string | null, token: string | null, accountId: string | null } | null;
}


export default class MailAcocount implements MailAccount {
    private Account: { username: string | null, password: string | null, token: string | null, accountId: string | null } | null
    private mailjs = new Mailjs();

    constructor() {
        this.Account = null
    }


    get AccountCreds() {
        return this.Account
    }

    async createAccount(): Promise<CreateOneAccount> {
        const result = await this.mailjs.createOneAccount();
        this.Account = { username: result.data.username, password: result.data.password, token: null, accountId: null }

        return { username: result.data.username, password: result.data.password };

    }

    async SignUpAccount(): Promise<ILoginResult> {
        if (this.Account !== null) {
            if (this.Account.username && this.Account.password) {
                const loginResult = await this.mailjs.login(this.Account.username, this.Account.password);
                this.Account.token = loginResult.data.token;
                this.Account.accountId = loginResult.data.id;
                return { token: loginResult.data.token, id: loginResult.data.id };
            } else {
                throw new Error('Please Create an account first')
            }
        } else {
            throw new Error('No Account Avaliable yet')
        }
    }
    async LoginAccount() {
        if (this.Account !== null) {
            if (this.Account.username && this.Account.password) {
                await this.mailjs.loginWithToken(this.Account.token);
            } else {
                throw new Error('Please Create an account first')
            }
        } else {
            throw new Error('No Account Avaliable yet')
        }
    }
    async getMessages(): Promise<IMessageResult[]> {
        return await this.mailjs.getMessages().then((res: { data: IMessageResult[] }) => res.data);
    }

    async getMessage(messageId: string): Promise<IMessageResult> {
        return await this.mailjs.getMessage(messageId);
    }

}



 */
import Mailjs from "@cemalgnlts/mailjs";

type CreateOneAccount = {
    username: string;
    password: string;
}

type ILoginResult = {
    token: string;
    id: string;
}

export interface IMessageResult {
    id: string;
    accountId: string;
    msgid: string;
    from: {
        address: string;
        name: string;
    };
    to: {
        address: string;
        name: string;
    };
    subject: string;
    intro: string;
    seen: boolean;
    isDeleted: boolean;
    hasAttachments: boolean;
    size: number;
    downloadUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface IMailAccount {
    username: string;
    password: string;
    token: string | null;
    accountId: string | null;
}

interface MailAccount {
    createAccount(): Promise<CreateOneAccount>;
    SignUpAccount(): Promise<ILoginResult>;
    getMessages(): Promise<IMessageResult[]>;
    getMessage(messageId: string): Promise<IMessageResult>;
    get AccountCreds(): IMailAccount | null;
}

export default class MailAcocount implements MailAccount {
    private Account: IMailAccount | null;
    private mailjs: Mailjs;

    constructor() {
        this.Account = null;
        this.mailjs = new Mailjs();
    }

    get AccountCreds() {
        return this.Account;
    }

    async createAccount(): Promise<CreateOneAccount> {
        try {
            const result = await this.mailjs.createOneAccount();
            this.Account = {
                username: result.data.username,
                password: result.data.password,
                token: null,
                accountId: null
            };

            return {
                username: result.data.username,
                password: result.data.password
            };
        } catch (error) {
            throw new Error(`Failed to create account: ${error}`);
        }
    }

    async SignUpAccount(): Promise<ILoginResult> {
        if (!this.Account) {
            throw new Error('No Account Available yet');
        }

        if (!this.Account.username || !this.Account.password) {
            throw new Error('Please Create an account first');
        }

        try {
            const loginResult = await this.mailjs.login(this.Account.username, this.Account.password);
            this.Account.token = loginResult.data.token;
            this.Account.accountId = loginResult.data.id;

            return {
                token: loginResult.data.token,
                id: loginResult.data.id
            };
        } catch (error) {
            throw new Error(`Login failed: ${error}`);
        }
    }

    private async ensureAuthenticated() {
        if (!this.Account?.token) {
            throw new Error('Not authenticated. Please sign in first.');
        }

        try {
            await this.mailjs.loginWithToken(this.Account.token);
        } catch (error) {
            throw new Error('Authentication failed. Please sign in again.');
        }
    }

    async getMessages(): Promise<IMessageResult[]> {
        await this.ensureAuthenticated();

        try {
            const response = await this.mailjs.getMessages();
            return response.data;
        } catch (error) {
            throw new Error(`Login failed: ${error}`);
        }
    }

    async getMessage(messageId: string): Promise<IMessageResult> {
        await this.ensureAuthenticated();

        try {
            const message = await this.mailjs.getMessage(messageId);
            return message.data;
        } catch (error) {
            throw new Error(`Failed to fetch message: ${error}`);
        }
    }
}