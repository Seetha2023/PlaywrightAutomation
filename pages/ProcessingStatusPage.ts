import { Page, expect } from "@playwright/test";

export class ProcessingStatusPage {

  constructor(private page: Page) {}

  private status = this.page.locator(
    '[data-testid="processing-status"]'
  );

  private processedCount = this.page.locator(
    '[data-testid="processed-count"]'
  );

  private invalidCount = this.page.locator(
    '[data-testid="invalid-count"]'
  );

  private duplicateCount = this.page.locator(
    '[data-testid="duplicate-count"]'
  );

  async open(batchId: string) {

    await this.page.goto(
      `/processing/${batchId}`
    );
  }

  async getStatus() {

    return await this.status.textContent();
  }

  async getProcessedCount() {

    return Number(
      await this.processedCount.textContent()
    );
  }

  async verifyStatus(expectedStatus: string) {

    await expect(this.status)
      .toHaveText(expectedStatus);
  }
}