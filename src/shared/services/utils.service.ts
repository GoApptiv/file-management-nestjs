import * as crypto from 'crypto';

export class UtilsProvider {
  /**
   * generate hash from string
   * @param {string} text
   * @param {'sha1' | 'sha256'} algorithm
   * @returns {string}
   */
  static generateHash(text: string, algorithm: 'sha1' | 'sha256'): string {
    const hash = crypto.createHmac(algorithm, text).digest('hex');
    return hash;
  }

  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }
}
