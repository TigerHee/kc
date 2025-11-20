import { getValidateLengthRule } from 'src/components/Account/Kyc/InstitutionalKyc/InstitutionalKycForm/config';

describe('test getValidateLengthRule', () => {
  test('test getValidateLengthRule', () => {
    const len = 5;
    const validateLengthRule = getValidateLengthRule(len);
    const validator = validateLengthRule[0].validator;

    expect(validator(null, '123456')).rejects.toThrow('af0b5f357ec64000acd6');
    expect(validator(null, '12345')).resolves.toBeUndefined();
  });
});
