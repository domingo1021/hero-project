import { HeroDataValidator } from '#hero/hero.validator';

describe('HeroDataValidator', () => {
  describe('isHero', () => {
    const testCases = [
      [
        'valid hero object',
        {
          id: '1',
          name: 'Hero A',
          image: 'http://hahow.com/image1.jpg',
        },
        true,
      ],
      [
        'invalid hero object with invalid id',
        {
          id: 'invalid',
          name: 'Hero A',
          image: 'http://hahow.com/image1.jpg',
        },
        false,
      ],
      [
        'invalid hero object with invalid name',
        {
          id: '1',
          name: '123',
          image: 'http://hahow.com/image1.jpg',
        },
        false,
      ],
      [
        'invalid hero object with invalid image',
        {
          id: '1',
          name: 'Hero A',
          image: 'invalid',
        },
        false,
      ],
    ];

    test.each(testCases)('should return %s', (_, hero, expected) => {
      const result = HeroDataValidator.isHero(hero);
      expect(result).toBe(expected);
    });
  });

  describe('isHeroProfile', () => {
    const testCases = [
      [
        'valid hero profile object',
        {
          str: 1,
          int: 2,
          agi: 3,
          luk: 4,
        },
        true,
      ],
      [
        'invalid hero profile object with invalid str',
        {
          str: 'invalid',
          int: 2,
          agi: 3,
          luk: 4,
        },
        false,
      ],
      [
        'invalid hero profile object with invalid int',
        {
          str: 1,
          int: 'invalid',
          agi: 3,
          luk: 4,
        },
        false,
      ],
      [
        'invalid hero profile object with invalid agi',
        {
          str: 1,
          int: 2,
          agi: 'invalid',
          luk: 4,
        },
        false,
      ],
      [
        'invalid hero profile object with invalid luk',
        {
          str: 1,
          int: 2,
          agi: 3,
          luk: 'invalid',
        },
        false,
      ],
      [
        'invalid hero profile object with missing str',
        {
          int: 2,
          agi: 3,
          luk: 4,
        },
        false,
      ],
      [
        'invalid hero profile object with missing int',
        {
          str: 1,
          agi: 3,
          luk: 4,
        },
        false,
      ],
      [
        'invalid hero profile object with missing agi',
        {
          str: 1,
          int: 2,
          luk: 4,
        },
        false,
      ],
      [
        'invalid hero profile object with missing luk',
        {
          str: 1,
          int: 2,
          agi: 3,
        },
        false,
      ],
    ];

    test.each(testCases)('should return %s', (_, profile: any, expected) => {
      const result = HeroDataValidator.isHeroProfile(profile);
      expect(result).toBe(expected);
    });
  });
});
