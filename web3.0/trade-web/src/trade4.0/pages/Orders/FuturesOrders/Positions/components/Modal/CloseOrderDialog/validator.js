/**
 * Owner: clyne@kupotech.com
 */
import Decimal from 'decimal.js';
import _ from 'lodash';
import { getDigit } from 'helper';

function numberValidation(value, cfgs = {}) {
  if (!_.isString(value)) {
    return false;
  }
  const { precision, dot = true, positive = false } = cfgs;
  let numberRegExp = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
  if (!dot) {
    numberRegExp = /^-?(0|[1-9][0-9]*)$/;
    if (_.isBoolean(positive) && positive) {
      numberRegExp = /^(0|[1-9][0-9]*)$/;
    }
  }

  if (dot) {
    let _precision;
    if (_.isNumber(precision)) {
      const decimalPre = new Decimal(precision);
      if (decimalPre.isInt() && decimalPre.gt(0)) {
        _precision = precision;
      }
    }
    if (!_.isUndefined(precision)) {
      if (_.isBoolean(positive) && positive) {
        numberRegExp = new RegExp(`^(0|[1-9][0-9]*)(\\.[0-9]{1,${_precision}})?$`);
      } else {
        numberRegExp = new RegExp(`^-?(0|[1-9][0-9]*)(\\.[0-9]{1,${_precision}})?$`);
      }
    }
  }

  const numberMatched = numberRegExp.test(value);
  return numberMatched;
}

export default function validator(value, { max, step }, { numericError, rangeError }) {
  const stepIsInteger = Number.isInteger(step);
  let validateCfg;
  if (stepIsInteger) {
    validateCfg = { dot: false, positive: true };
  } else {
    const precision = getDigit(step);
    validateCfg = { precision, positive: true };
  }
  const valid = numberValidation(value, validateCfg);
  if (!valid) {
    return numericError;
  }
  const dValue = new Decimal(value);
  if (!dValue.mod(step).eq(0)) {
    return numericError;
  }
  if (dValue.lte(0) || dValue.gt(max)) {
    return rangeError;
  }
}
