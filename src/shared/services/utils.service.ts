import * as crypto from 'crypto';

export class UtilsService {
  /**
   * Generate hash from string
   */
  static generateHash(text: string, algorithm: 'sha1' | 'sha256'): string {
    const hash = crypto.createHmac(algorithm, text).digest('hex');
    return hash;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }

  /**
   * Decode key value from database
   */
  static base64decodeKey(encodedKey: string): string {
    return Buffer.from(encodedKey, 'base64').toString().replace(/\\n/gm, '\n');
  }

  /**
   * Extract project id from gcp email id
   */
  static extractProjectIdFromGcpEmailId(email: string): string {
    return email.split('@')[1].replace('.iam.gserviceaccount.com', '');
  }
}
