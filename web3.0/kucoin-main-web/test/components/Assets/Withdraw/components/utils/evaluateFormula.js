import { getFeeUsewithdrawFeeFormula } from 'src/components/Assets/Withdraw/components/utils/evaluateFormula.js'; // replace with your actual file path

describe('getFeeUsewithdrawFeeFormula', () => {
  it('should calculate fee correctly', () => {
    const userQuota = {
      withdrawMaxFee: '10',
      precision: 2,
      withdrawFeeFormulaV2: 'amount * 0.01',
    };
    const withdrawForm = {
      amount: '100',
    };

    const result = getFeeUsewithdrawFeeFormula({ userQuota, withdrawForm });
    expect(result).toEqual('1'); // replace with expected result
  });

  it('should return 0 if formula or amount is not provided', () => {
    const userQuota = {
      withdrawMaxFee: '10',
      precision: 2,
    };
    const withdrawForm = {};

    const result = getFeeUsewithdrawFeeFormula({ userQuota, withdrawForm });
    expect(result).toEqual(0);
  });
});
