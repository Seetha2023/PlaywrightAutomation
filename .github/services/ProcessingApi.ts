import { APIRequestContext } from "@playwright/test";
import { Logger } from "../utils/Logger";

export class ProcessingApi {

  constructor(private request: APIRequestContext) {}

  async getProcessingStatus(batchId: string) {

    const response = await this.request.get(
      `/api/files/${batchId}/status`
    );

    if (!response.ok()) {

      throw new Error(
        `Unable to retrieve processing status. HTTP ${response.status()}`
      );
    }

    return await response.json();
  }

  async waitForCompletion(
    batchId: string,
    expectedStatus: string,
    timeoutMs = 120000,
    pollingIntervalMs = 5000
  ) {

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {

      const result = await this.getProcessingStatus(batchId);

      Logger.info(
        `Batch ${batchId} status = ${result.status}`
      );

      if (result.status === expectedStatus) {

        return result;
      }

      if (
        result.status === "FAILED" &&
        expectedStatus !== "FAILED"
      ) {

        throw new Error(
          `Batch processing failed unexpectedly: ${JSON.stringify(result)}`
        );
      }

      await new Promise(
        resolve => setTimeout(resolve, pollingIntervalMs)
      );
    }

    throw new Error(
      `Processing did not reach ${expectedStatus} within ${timeoutMs} ms`
    );
  }
}