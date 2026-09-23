// Load the package at runtime so this file does not require its type declarations.
declare const require: (moduleName: string) => any;

export class SftpService {

  private client: any;

  constructor() {
    this.client = undefined;
  }

  async connect(): Promise<void> {

    let SftpClient: any;
    try {
      SftpClient = require('ssh2-sftp-client');
    } catch {
      throw new Error(
        "The 'ssh2-sftp-client' package is required for SFTP operations. Install it with 'npm install ssh2-sftp-client'."
      );
    }

    this.client = new SftpClient();

    await this.client.connect({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT || 22),
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD
    });
  }

  async uploadFile(
    localFile: string,
    remoteFile: string
  ): Promise<void> {

    await this.client.put(localFile, remoteFile);
  }

  async disconnect(): Promise<void> {

    await this.client.end();
  }
}