export interface FileTestData {
  fileName: string;
  fileCondition: string;
  expectedStatus: string;
  expectedResult: string;
  processedCount: number;
  invalidCount: number;
  duplicateCount: number;
  invitationStatus: string;
}

export const fileProcessingData: FileTestData[] = [
  {
    fileName: 'valid_100.csv',
    fileCondition: 'valid',
    expectedStatus: 'SUCCESS',
    expectedResult: 'processed successfully',
    processedCount: 100,
    invalidCount: 0,
    duplicateCount: 0,
    invitationStatus: 'ALLOWED'
  },

  {
    fileName: 'missing_customer.csv',
    fileCondition: 'missing_mandatory',
    expectedStatus: 'REJECTED',
    expectedResult: 'validation failed',
    processedCount: 0,
    invalidCount: 1,
    duplicateCount: 0,
    invitationStatus: 'BLOCKED'
  },

  {
    fileName: 'invalid_email.csv',
    fileCondition: 'invalid_field',
    expectedStatus: 'REJECTED',
    expectedResult: 'validation failed',
    processedCount: 0,
    invalidCount: 1,
    duplicateCount: 0,
    invitationStatus: 'BLOCKED'
  },

  {
    fileName: 'duplicate_file.csv',
    fileCondition: 'duplicate_file',
    expectedStatus: 'REJECTED',
    expectedResult: 'duplicate detected',
    processedCount: 0,
    invalidCount: 0,
    duplicateCount: 100,
    invitationStatus: 'BLOCKED'
  }
];