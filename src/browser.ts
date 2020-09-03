import {Browser as PuppeteerBrowser, launch} from "puppeteer";
import {terminal} from "@gorkun/terminal";
import {ChromiumPage} from "./page";

export class Browser {

    #browser: PuppeteerBrowser;

    constructor(private readonly userAgent: string) {
    }

    async initialize() {
        const loader = terminal.loader('Launching the browser.');

        this.#browser = await launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--incognito'
            ]
        });

        loader.succeed('The browser initialized.');
    }

    async goto(url: string): Promise<ChromiumPage> {

        const page = await this.emptyPage();
        await page.goto(url);

        return page;
    }

    async emptyPage(): Promise<ChromiumPage> {

        if (!this.#browser) {
            throw new Error('You must call initialize() before you can use the goto');
        }

        const page = await this.#browser.newPage();
        await page.setUserAgent(this.userAgent);

        return new ChromiumPage(page);
    }

    async close(): Promise<void> {

        if (!this.#browser) {
            return;
        }

        const loader = terminal.loader('Closing the browser.');
        await this.#browser.close();
        loader.succeed('The browser closed.');
    }
}