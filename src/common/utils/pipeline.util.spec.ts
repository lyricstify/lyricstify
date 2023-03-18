import { faker } from '@faker-js/faker';
import { pipeline } from './pipeline.util.js';

describe('pipeline', () => {
  const multiplyByTwo = (x: number) => x * 2;
  const addByOne = (x: number) => x + 1;

  it('should be able to transform the given value', () => {
    const transform = pipeline(multiplyByTwo, addByOne);
    const value = faker.datatype.number();

    expect(transform(value)).toBe(value * 2 + 1);
  });
});
