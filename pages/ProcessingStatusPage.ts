import { Locator, Page, expect } from "@playwright/test";

export class ProcessingStatusPage {

  private status: Locator;
  private processedCount: Locator;
  private invalidCount: Locator;
  private duplicateCount: Locator;

  constructor(private page: Page) {
    this.status = page.locator('[data-testid="processing-status"]');
    this.processedCount = page.locator('[data-testid="processed-count"]');
    this.invalidCount = page.locator('[data-testid="invalid-count"]');
    this.duplicateCount = page.locator('[data-testid="duplicate-count"]');
  }

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