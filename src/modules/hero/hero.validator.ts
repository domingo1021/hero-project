import { Hero, HeroProfile } from '#hero/dto';

/**
 * A class that contains static utils methods to validate hero data.
 */
export class HeroDataValidator {
  static readonly INT_REGEX = /^-?\d+$/;
  static readonly ALPHABET_REGEX = /^[a-zA-Z ]+$/;
  static readonly URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

  public static isHero(obj: any): obj is Hero {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      HeroDataValidator.INT_REGEX.test(obj.id) &&
      typeof obj.name === 'string' &&
      HeroDataValidator.ALPHABET_REGEX.test(obj.name) &&
      typeof obj.image === 'string' &&
      HeroDataValidator.URL_REGEX.test(obj.image)
    );
  }

  public static isHeroProfile(obj: any): obj is HeroProfile {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.str === 'number' &&
      HeroDataValidator.INT_REGEX.test(`${obj.str}`) &&
      typeof obj.int === 'number' &&
      HeroDataValidator.INT_REGEX.test(`${obj.int}`) &&
      typeof obj.agi === 'number' &&
      HeroDataValidator.INT_REGEX.test(`${obj.agi}`) &&
      typeof obj.luk === 'number' &&
      HeroDataValidator.INT_REGEX.test(`${obj.luk}`)
    );
  }
}
