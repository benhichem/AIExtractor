import MailAcocount from "./component/email.js"
import ImessageResult from "./component/email.js";
import { CreateAiExtractionAccount } from "./component/scraper.js";
import { extractValidationLink, Sleep } from "./component/utils.js";

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
                await browser.CreateAPIkeys()
                // we save the account and the apikey into a 
            }

        }

    } catch (error) {
        console.log(error)
    }
}


GenerateAccount()