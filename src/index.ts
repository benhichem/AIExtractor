import { Data_Source } from "./component/database/data-source.js";
import MailAcocount from "./component/email.js"
import ImessageResult from "./component/email.js";
import { CreateAiExtractionAccount } from "./component/scraper.js";
import { extractValidationLink, getRandomItem, Sleep } from "./component/utils.js";
import "reflect-metadata"
import { Account } from "./component/database/account-entity.js";
import { ERROR } from "sqlite3";
import { GenerateProxies } from "./component/proxies.js";
import { argv } from "process";

async function GenerateAccount() {
    try {
        // we create an account
        const mailAccount = new MailAcocount()
        await mailAccount.createAccount();
        await mailAccount.SignUpAccount();
        let accountDetails = mailAccount.AccountCreds
        console.log(accountDetails);
        let browser = new CreateAiExtractionAccount(accountDetails!.username!, accountDetails!.password!);
        await browser.CreateAiExtracaAccount();
        let validationEmailReceived = false;
        let email: any | null = null;
        while (!validationEmailReceived) {
            let message = await mailAccount.getMessages();
            console.log(message);
            let validEmail = message.filter(item => item.subject.includes('Verify your email'))
            if (validEmail.length > 0) {
                let ValidationMessage = await mailAccount.getMessage(validEmail[0].id);
                console.log(ValidationMessage);
                email = ValidationMessage;
                validationEmailReceived = true;
            }
            await Sleep(5000);
        }

        if (email !== null) {
            let verificationUrl = extractValidationLink(email.text);
            console.log(verificationUrl);
            if (verificationUrl !== null) {
                await browser.VerifyAccount(verificationUrl)
                let apikeys = await browser.CreateAPIkeys()
                return {
                    apikey: apikeys,
                    username: accountDetails?.username,
                    password: accountDetails?.password
                }
            }
        } else {
            throw new Error("Validation Email failed ...")
        }

        await browser.cleanup()
    } catch (error) {
        console.log(error)
        throw new Error("Account Creation failed ...")
    }
}


/* GenerateAccount() */


async function Run(accountCount: number) {
    const dataSource = await Data_Source.initialize()
        .then((data) => { return data })
        .catch((error) => {
            console.log(error)
            throw new Error("Database Connection failed ...")
        });
    const proxies = await GenerateProxies();

    for (let index = 0; index < 2; index++) {
        if (proxies) {
            let proxy = getRandomItem(proxies);
            let apikey = await GenerateAccount();
            if (apikey) {
                let accountRepo = dataSource.getRepository(Account);
                if (apikey.apikey) {
                    const acc = new Account();
                    acc.apiKey = apikey.apikey;
                    acc.username = apikey.username ? apikey.username : "";
                    acc.password = apikey.password ? apikey.password : "";
                    await accountRepo.save(acc);
                }
            }
        } else {
            break;
        }
    }
    dataSource.destroy().then(() => {
        console.log('[+] Closing conneciton ...')
    });
}

const consoleArgs: number = eval(argv[2]);

console.log(consoleArgs);




Run(consoleArgs);

process.on('uncaughtException', (err) => {
    console.log('Grabbed an uncaught exception.')
    console.log(JSON.stringify(err))
})

process.on('unhandledRejection', (err) => {
    console.log('Grabbed an unhandled rejection.')
    console.log(JSON.stringify(err))
})