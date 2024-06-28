import { Hero, HeroProfile } from './dto';

/**
 * A class that contains static utils methods to validate hero data.
 */
export class HeroDataValidator {
  public static isHero(obj: any): obj is Hero {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.image === 'string'
    );
  }

  public static isHeroProfile(obj: any): obj is HeroProfile {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.str === 'number' &&
      typeof obj.int === 'number' &&
      typeof obj.agi === 'number' &&
      typeof obj.luk === 'number'
    );
  }
}
