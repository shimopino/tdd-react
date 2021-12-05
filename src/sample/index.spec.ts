import { add } from '.';

describe('動作検証用', () => {
  it('足し算のテスト', () => {
    expect(add(1, 2)).toBe(3);
  });
});
