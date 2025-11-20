/**
 * Owner: tiger@kupotech.com
 */
import {
  getKycDisplayName,
  isPersonalNotKycPass,
  isVerifyingStatus,
  VERIFY_ITEM,
  VERIFY_STATUS,
  TOTAL_FIELDS,
  TOTAL_FIELD_INFOS,
} from 'src/routes/AccountPage/Kyc/config';
import { PHOTO_TYPE } from 'src/components/Account/Kyc/common/constants';
import { customRender } from 'test/setup';

describe('test newKycConfig', () => {
  test('test newKycConfig', () => {
    expect(VERIFY_STATUS['0'].description()).toBe('kyc.account.sec.reviewing.notice.info');
    expect(customRender(VERIFY_STATUS['2'].description()).container.innerHTML).toContain(
      'account.ekyc.retry.tip',
    );
    const VERIFY_STATUS_2 = VERIFY_STATUS['2'].description('reason');
    const { container } = customRender(<VERIFY_STATUS_2 />);
    expect(container.innerHTML).toContain(
      'kyc.account.sec.review.certificate.submit.failed.reason',
    );

    expect(
      customRender(VERIFY_STATUS['2'].description('reason', true)).container.innerHTML,
    ).toContain('kyc.account.sec.review.certificate.submit.failed.reason');
    expect(
      customRender(VERIFY_STATUS['5'].description('reason', true, { regionCode: 'OT' })).container
        .innerHTML,
    ).toContain('account.ekyc.forbidden.desc');
    expect(
      customRender(VERIFY_STATUS['5'].description('reason', true, { regionCode: 'HK' })).container
        .innerHTML,
    ).toContain('kyc.account.sec.review.gov.restrictions.passnot.info');
    expect(
      customRender(VERIFY_STATUS['5'].description('reason', true)).container.innerHTML,
    ).toContain('kyc.account.sec.review.gov.restrictions.passnot.info');
    expect(
      customRender(VERIFY_STATUS['8'].description('reason', true, { regionCode: 'OT' })).container
        .innerHTML,
    ).toContain('account.ekyc.forbidden.desc');
    expect(
      customRender(VERIFY_STATUS['8'].description('reason', true, { regionCode: 'HK' })).container
        .innerHTML,
    ).toContain('account.ekyc.retry.tipaccount.ekyc.fail.checkitem');
    expect(
      customRender(VERIFY_STATUS['8'].description('reason', true)).container.innerHTML,
    ).toContain('account.ekyc.retry.tipaccount.ekyc.fail.checkitem');
    expect(
      customRender(
        VERIFY_STATUS['8'].description('reason', true, {
          regionCode: 'HK',
          failureReasonLists: ['failureReason'],
        }),
      ).container.innerHTML,
    ).toContain('failureReason');
    expect(
      customRender(
        VERIFY_STATUS['8'].description('reason', true, {
          regionCode: 'HK',
          failureReasonLists: [''],
        }),
      ).container.innerHTML,
    ).toContain('account.ekyc.fail.checkitem');
    expect(
      customRender(
        VERIFY_STATUS['8'].description('reason', true, {
          regionCode: 'HK',
          failureReasonLists: null,
        }),
      ).container.innerHTML,
    ).toContain('account.ekyc.fail.checkitem1');

    expect(isVerifyingStatus(0)).toBe(true);
    expect(isVerifyingStatus(3)).toBe(true);
    expect(isVerifyingStatus(7)).toBe(true);
    expect(isVerifyingStatus(5)).toBe(false);
    expect(isVerifyingStatus(2)).toBe(false);
    expect(isVerifyingStatus(4)).toBe(false);
    expect(isVerifyingStatus(8)).toBe(false);
    expect(isVerifyingStatus(6)).toBe(false);
    expect(isVerifyingStatus(-1)).toBe(false);

    expect(isPersonalNotKycPass(-1)).toBe(true);
    expect(isPersonalNotKycPass(2)).toBe(true);
    expect(isPersonalNotKycPass(4)).toBe(true);
    expect(isPersonalNotKycPass(5)).toBe(true);
    expect(isPersonalNotKycPass(6)).toBe(true);
    expect(isPersonalNotKycPass(8)).toBe(true);
    expect(isPersonalNotKycPass(3)).toBe(false);
    expect(isPersonalNotKycPass(7)).toBe(false);

    expect(getKycDisplayName({ firstName: '', lastName: '' })).toBe('');
    expect(getKycDisplayName({})).toBe('');

    expect(getKycDisplayName({ regionCode: 'CN', firstName: 'first', lastName: 'last' })).toBe(
      'lastfirst',
    );
    expect(getKycDisplayName({ regionCode: 'TW', firstName: 'first', lastName: 'last' })).toBe(
      'lastfirst',
    );
    expect(getKycDisplayName({ regionCode: 'HK', firstName: 'first', lastName: 'last' })).toBe(
      'lastfirst',
    );
    expect(getKycDisplayName({ regionCode: 'OT', firstName: 'first', lastName: 'last' })).toBe(
      'first last',
    );
  });

  test('should return correct translation keys for each VERIFY_ITEM property', () => {
    const expectedTranslations = {
      lastName: 'kyc.form.lastName',
      firstName: 'kyc.form.firstName',
      gender: 'kyc.form.gender',
      regionName: 'kyc.form.nation',
      idType: 'kyc.form.cardType',
      idNumber: 'kyc.form.cardNo',
      idExpireDate: 'kyc.form.expiryDate',
      frontPhoto: 'kyc.form.frontPhoto',
      backPhoto: 'kyc.form.backPhoto',
      handlePhoto: 'kyc.form.handlePhoto',
      faceDetection: 'kyc.verify.faceDetection',
      identityVerification: 'kyc.verify',
      incumbencyPhoto: 'kyc.contacts.incumbency',
      registrationAttachment: 'kyc.doc.reg',
      handleRegistrationAttachment: 'kyc.verification.info.hold.corp.docum',
      name: 'kyc.company.name',
      registrationDate: 'kyc.company.regDate',
      code: 'kyc.company.code',
      dutyParagraph: 'kyc.company.taxCode',
      capitalSource: 'kyc.company.ivSource',
      tradeAmount: 'kyc.mechanism.verify.company.trading.volume',
      workCountry: 'kyc.form.nation',
      workCity: 'kyc.form.city',
      workProvince: 'kyc.form.state',
      workStreet: 'kyc.form.street',
      workHome: 'kyc.form.houseno',
      workPostcode: 'kyc.form.postcode',
      registrationCountry: 'kyc.form.nation',
      registrationCity: 'kyc.form.city',
      registrationProvince: 'kyc.form.state',
      registrationStreet: 'kyc.form.street',
      registrationHome: 'kyc.form.houseno',
      registrationPostcode: 'kyc.form.postcode',
      directorAttachments: 'kyc.verification.info.documents.item5',
      authorizeAttachments: 'kyc.verification.info.documents.item1',
      performanceAttachments: 'kyc.verification.info.documents.item2',
      shareholdersAttachments: 'kyc.verification.info.documents.item3',
      otherAttachments: 'kyc.verification.info.documents.item4',
      governmentWebsite: 'kyc.company.govUrl',
      officialWebsite: 'kyc.company.url',
      director: 'kyc.company.director',
      middleName: 'kyc.form.middleName1',
      middleName2: 'kyc.form.middleName2',
      duty: 'kyc.contact.information.position',
      facePhoto: 'aDxH6pLT7pajsxdJKjdU9x',
    };

    Object.keys(VERIFY_ITEM).forEach((key) => {
      const result = VERIFY_ITEM[key]();
      expect(result).toBe(expectedTranslations[key]);
    });
  });
});

describe('test TOTAL_FIELD_INFOS', () => {
  const allPhotoType = Object.values(PHOTO_TYPE);
  Object.keys(TOTAL_FIELD_INFOS).forEach(key => {
    test(`test TOTAL_FIELD_INFOS.${key}`, () => {
      expect(TOTAL_FIELDS.hasOwnProperty(key)).toBe(true);
      const { title, description, photoType } = TOTAL_FIELD_INFOS[key];
      const companyInfo = { companyType: '1' };
      if (title) {
        expect(title(companyInfo)).toBeTruthy();
      }
      if (description) {
        expect(description(companyInfo)).toBeTruthy();
      }
      if (photoType) {
        expect(allPhotoType.includes(photoType(companyInfo))).toBe(true);
      }
    })
  })
})