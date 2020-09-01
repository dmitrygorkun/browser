import {ElementHandle, Page as PuppeteerPage} from "puppeteer";

declare var window: any;

export class ChromiumPage {

    constructor(private readonly page: PuppeteerPage) {
    }

    content(): Promise<string> {
        return this.page.content();
    }

    url(): string {
        return this.page.url();
    }

    async type(selector: string, value: string | number): Promise<void> {
        await this.page.type(selector, value.toString());
    }

    async key(button: string): Promise<void> {
        await this.page.keyboard.press(button);
    }

    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }

    async waitForNavigation(timeout: number = 500): Promise<void> {
        await this.page.waitForNavigation({
            timeout,
            waitUntil: 'domcontentloaded'
        });
    }

    var(name: string): Promise<any> {
        return this.page.evaluate(async (name: string) => window[name], name);
    }

    element(selector: string): Promise<ElementHandle | null> {
        return this.page.$(selector);
    }

    async request(url: string): Promise<any> {

        const promise = await this.page.evaluate(async (url) => {
            try {
                return await (await fetch(url)).json()
            } catch (e) {
                return null;
            }
        }, url);

        if (promise === null) {
            throw new Error(`Ajax request ${url} failed.`);
        }

        return promise;
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async close(): Promise<void> {
        await this.page.close();
    }
}