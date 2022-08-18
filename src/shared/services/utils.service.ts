import * as crypto from 'crypto';

export class UtilsService {
  /**
   * generate hash from string
   */
  static generateHash(text: string, algorithm: 'sha1' | 'sha256'): string {
    const hash = crypto.createHmac(algorithm, text).digest('hex');
    return hash;
  }

  /**
   * generate random string
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }

  /**
   * decode key value from database
   */
  static base64decodeKey(encodedKey: string): string {
    return Buffer.from(encodedKey, 'base64').toString().replace(/\\n/gm, '\n');
  }

  /**
   * extract project id from gcp email id
   */
  static extractProjectIdFromGcpEmailId(email: string): string {
    return email.split('@')[1].replace('.iam.gserviceaccount.com', '');
  }
}
