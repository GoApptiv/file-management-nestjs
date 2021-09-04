import bcrypt from 'bcrypt';

export class UtilsProvider {
  /**
   * generate hash from string
   * @param {string} text
   * @returns {string}
   */
  static generateHash(text: string): string {
    return bcrypt.hashSync(text, 10);
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
  /**
   * validate text with hash
   * @param {string} text
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static validateHash(text: string, hash: string): Promise<boolean> {
    if (!text || !hash) {
      return Promise.resolve(false);
    }
    return bcrypt.compare(text, hash);
  }
}
