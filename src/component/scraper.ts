import { Browser, Page } from "puppeteer";
import WebAutomation from "./interfaces/scraper.js";
import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { Sleep } from "./utils.js";

import clipboard from 'clipboardy';
/* puppeteer = puppeteer.default */
const puppeteerBrowser = puppeteer.default;

export class CreateAiExtractionAccount {
    browser: Browser | null;
    page: Page | null;

    constructor(private username: string, private password: string) {
        this.browser = null;
        this.page = null;
    }

    async createBrowser() {
        if (this.browser === null && this.page === null) {

            puppeteerBrowser.use(stealthPlugin());
            this.browser = await puppeteerBrowser.launch({
                headless: false,
                args: ['--proxy-server:http://']
            })
            this.page = await this.browser.newPage();
        } else {
            throw new Error("Browser already exists");
        }
    };

    async cleanup() {
        if (this.browser !== null && this.page !== null) {
            this.browser.close();
            this.browser = null;
            this.page = null;
        } else {
            throw new Error("Browser already closed");
        }
    }

    async CreateAiExtracaAccount() {
        try {
            await this.createBrowser();
            await this.page?.goto("http://app.extracta.ai/register", { timeout: 0, waitUntil: "networkidle2" });
            await this.page?.type("#email", this.username, { delay: 110 });
            await this.page?.type('#password', this.password, { delay: 110 });
            await this.page?.type('#confirm_password', this.password, { delay: 110 });
            await this.page?.click('#terms');
            await this.page?.click("button");
            await Sleep(10000);
            return
        } catch (error) {
            console.log(error);
        }
    }


    async VerifyAccount(link: string) {
        try {
            const newPage = await this.browser?.newPage();
            await newPage?.goto(link, { timeout: 0, waitUntil: "networkidle2" });
            await Sleep(10000);
            await newPage?.close();
        } catch (error) {
            console.log(error);
        }
    }



    async CreateAPIkeys() {
        try {
            const newPage = await this.browser?.newPage();
            await newPage?.goto(('https://app.extracta.ai/dashboard'), { timeout: 0, waitUntil: "networkidle2" });
            await newPage?.reload();
            console.log('navigating to the page for api')
            await newPage?.goto('https://app.extracta.ai/api', { timeout: 0, waitUntil: "networkidle2" });
            return await newPage?.waitForSelector('[class*="sm:flex-none"] button')
                .then(async () => {
                    await newPage?.click('[class*="sm:flex-none"] button');
                    await Sleep(10000);
                    await newPage?.click('table tbody tr td[class*="whitespace-nowrap"] button')
                    let apikey = clipboard.readSync();
                    console.log("NEW API KEY IS :: ", apikey);
                    return apikey;
                }).catch((err) => {
                    console.log(err)
                })

        } catch (error) {
            throw error;
        }
    }
}





