// Load the package at runtime so this file does not require its type declarations.
declare const require: (moduleName: string) => any;
const SftpClient = require('ssh2-sftp-client');

export class SftpService {

  private client: typeof SftpClient;

  constructor() {
    this.client = new SftpClient();
  }

  async connect(): Promise<void> {

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