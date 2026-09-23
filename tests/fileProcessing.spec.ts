import {
  test,
  expect
} from "@playwright/test";

import { fileProcessingData } from "../test-data/fileProcessingData";
import { SftpService } from "../services/SftpService";
import { ProcessingApi } from "../services/ProcessingApi";
import { Logger } from "../utils/Logger";
import { retry } from "../utils/Retry";

for (const data of fileProcessingData) {

  test(
    `Verify file processing - ${data.fileName}`,
    async ({ request }) => {

      const sftp = new SftpService();

      let batchId: string | undefined;

      try {

        Logger.step(
          `Starting test: ${data.fileName}`
        );

        // -----------------------------------------
        // 1. Connect to SFTP
        // -----------------------------------------

        await sftp.connect();

        // -----------------------------------------
        // 2. Upload file
        // -----------------------------------------

        const localPath =
          `test-data/files/${data.fileName}`;

        const remotePath =
          `/inbound/${data.fileName}`;

        await retry(
          () => sftp.uploadFile(
            localPath,
            remotePath
          ),
          3,
          3000
        );

        Logger.info(
          `Uploaded ${data.fileName}`
        );

        // -----------------------------------------
        // 3. Get batch ID
        // -----------------------------------------

        const processingApi =
          new ProcessingApi(request);

        batchId =
          await getBatchId(
            request,
            data.fileName
          );

        Logger.info(
          `Batch ID = ${batchId}`
        );

        // -----------------------------------------
        // 4. Wait for processing
        // -----------------------------------------

        const result =
          await processingApi.waitForCompletion(
            batchId,
            data.expectedStatus
          );

        // -----------------------------------------
        // 5. Validate status
        // -----------------------------------------

        expect(
          result.status,
          "Incorrect file processing status"
        ).toBe(data.expectedStatus);

        // -----------------------------------------
        // 6. Validate processing result
        // -----------------------------------------

        expect(
          result.processingResult
        ).toBe(data.expectedResult);

        // -----------------------------------------
        // 7. Validate record counts
        // -----------------------------------------

        expect(
          result.processedCount
        ).toBe(data.processedCount);

        expect(
          result.invalidCount
        ).toBe(data.invalidCount);

        expect(
          result.duplicateCount
        ).toBe(data.duplicateCount);

        // -----------------------------------------
        // 8. Validate downstream processing
        // -----------------------------------------

        expect(
          result.invitationStatus
        ).toBe(data.invitationStatus);

        // -----------------------------------------
        // 9. Validate audit information
        // -----------------------------------------

        expect(
          result.auditStatus
        ).toBeDefined();

        Logger.info(
          `Test passed for ${data.fileName}`
        );

      } catch (error) {

        Logger.error(
          `Test failed for ${data.fileName}: ${error}`
        );

        throw error;

      } finally {

        // -----------------------------------------
        // 10. Cleanup
        // -----------------------------------------

        try {

          await sftp.disconnect();

        } catch (cleanupError) {

          Logger.warn(
            `SFTP cleanup failed: ${cleanupError}`
          );
        }
      }
    }
  );
}

async function getBatchId(
  request: any,
  fileName: string
): Promise<string> {

  const response =
    await request.get(
      `/api/files/search?fileName=${fileName}`
    );

  if (!response.ok()) {

    throw new Error(
      `Unable to retrieve batch ID. HTTP ${response.status()}`
    );
  }

  const data = await response.json();

  if (!data.batchId) {

    throw new Error(
      `Batch ID not found for file ${fileName}`
    );
  }

  return data.batchId;
}