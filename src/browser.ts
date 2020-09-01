import {Browser as PuppeteerBrowser, launch, devices} from "puppeteer";
import {terminal} from "@gorkun/terminal";
import {ChromiumPage} from "./page";

export class Browser {

    #browser: PuppeteerBrowser;

    private get args(): string[] {
        return [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--incognito',
            `--user-agent="${this.userAgent}"`
        ];
    }

    constructor(private readonly userAgent: string) {
    }

    async initialize() {
        const loader = terminal.loader('Launching the browser.');
        this.#browser = await launch({ args: this.args });
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
        await page.emulate(devices['iPad Pro landscape']);

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