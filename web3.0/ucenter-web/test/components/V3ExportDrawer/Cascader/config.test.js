import { getTopCodes, options } from 'src/components/V3ExportDrawer/config';

describe('getTopCodes', () => {
  it('should return an array of top codes', () => {
    const result = getTopCodes(options);
    expect(result).toBeInstanceOf(Array);
    expect(result).toContain('MAIN-ACCOUNT-DETAILS');
  });

  it('should return an empty array if no top codes are present', () => {
    const result = getTopCodes([]);
    expect(result).toEqual([]);
  });

  // Add more tests as needed
});
