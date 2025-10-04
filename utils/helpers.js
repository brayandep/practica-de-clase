class Helpers {
    static async takeScreenshot(page, testName) {
        const screenshotPath = `screenshots/${testName}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        return screenshotPath;
    }

    static async waitForApiResponse(page, urlPattern) {
        await page.waitForResponse(response => 
            response.url().includes(urlPattern) && response.status() === 200
        );
    }

    static generateRandomString(length = 8) {
        return Math.random().toString(36).substring(2, length + 2);
    }
}

module.exports = Helpers;