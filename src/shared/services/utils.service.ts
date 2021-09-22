import * as crypto from 'crypto';

export class UtilsService {
  /**
   * generate hash from string
   * @param text
   * @param algorithm
   * @returns hash string
   */
  static generateHash(text: string, algorithm: 'sha1' | 'sha256'): string {
    const hash = crypto.createHmac(algorithm, text).digest('hex');
    return hash;
  }

  /**
   * generate random string
   * @param length - lenght of random string
   * @returns random string of specified length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }

  /**
   * decode key value from database
   * @param encodedKey - encoded key
   * @returns base64 decoded string
   */
  static base64decodeKey(encodedKey: string): string {
    return Buffer.from(encodedKey, 'base64').toString().replace(/\\n/gm, '\n');
  }
}
