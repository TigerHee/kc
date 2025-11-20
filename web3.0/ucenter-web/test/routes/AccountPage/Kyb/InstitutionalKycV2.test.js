import { merge, uniqueId } from 'lodash-es';
import InstitutionalKycV2 from 'src/routes/AccountPage/Kyc/Kyb/Certification'
import { COMPANY_TYPE } from 'src/routes/AccountPage/Kyc/config';
import { customRender } from 'test/setup';
import moment from 'moment';

jest.mock('src/services/kyb', () => ({
  __esModule: true,
  postCompanyAddition: jest.fn().mockResolvedValue({ success: true, data: null }),
  postCompanyContact: jest.fn().mockResolvedValue({ success: true, data: null }),
  postCompanyCredentials: jest.fn().mockResolvedValue({ success: true, data: null }),
  postCompanyNormal: jest.fn().mockResolvedValue({ success: true, data: null }),
  postCompanySubmit: jest.fn().mockResolvedValue({ success: true, data: null })
}));

const mockDispatch = jest.fn().mockResolvedValue({});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
  };
});

const createFileItem = () => {
  const fileId = `file_id_${uniqueId()}`;
  return {
    fileId,
    url: `https://file-service.com/${fileId}.jpg`,
    materialName: fileId,
    materialType: 'jpg'
  }
}

describe('institutional-kyc v2', () => {
  const originRequestIdleCallback = window.requestIdleCallback;
  const originCancelIdleCallback = window.cancelIdleCallback;
  const originScrollBy = window.scrollBy;
  const originScrollTo = window.scrollTo;

  window.requestIdleCallback = jest.fn();
  window.cancelIdleCallback = jest.fn();
  window.scrollBy = jest.fn();
  window.scrollTo = jest.fn();

  afterAll(() => {
    window.requestIdleCallback = originRequestIdleCallback;
    window.cancelIdleCallback = originCancelIdleCallback;
    window.scrollBy = originScrollBy;
    window.scrollTo = originScrollTo;
  });
  
  describe('companyType is NORMAL', () => {
    const originState = {
      kyc: {
        kybInfo: {
          verifyStatus: -1
        }
      },
      kyb: {
        companyDetail: {
          companyType: COMPANY_TYPE.NORMAL,
          currentPhase: 1,
          name: 'alibaba',
          registrationDate: moment('2019-12-25'),
          code: 'AZ001',
          dutyParagraph: '11111',
          capitalSource: '22222',
          tradeAmount: 't002',
          director: '33333',
          registrationCountry: 'AD',
          registrationProvince: '44444',
          registrationCity: '55555',
          registrationPostcode: '66666',
          registrationStreet: '77777',
          registrationHome: '88888',
          detailSameOfficeAddress: true,
          registrationAttachment: [createFileItem()],
          handleRegistrationAttachment: [createFileItem()],
          // step2
          firstName: 'tony',
          lastName: 'stack',
          middleName: '',
          middleName2: '',
          duty: 'CEO',
          imAccount: 'iconMan',
          detailContactorPhotoType: 'idCard',
          idExpireDate: moment('2035-01-01'),
          frontPhoto: [createFileItem()],
          backPhoto: [createFileItem()],
          handlePhoto: [createFileItem()],
          // step3
          detailDirectorSingle: true,
          authorizeAttachment: [createFileItem()],
          directorAttachment: [createFileItem()],
          directorCertificate: [createFileItem()],
          performanceAttachment: [createFileItem()],
          shareholdersAttachment: [createFileItem()],
          detailIndividualShareholdersRatio: true,
          actualController: [createFileItem()],
          detailInstitutionShareholdersRatio: true,
          shareholdingExceedsOneFourth: [createFileItem()],
          detailOfficialSealAvailable: true,
          unstampedCertificate: [createFileItem()],
          // step4
          dueDiligence: []
        }
      }
    }
    it('step 1', async () => {
      customRender(<InstitutionalKycV2 />, originState);
    });
    it('step 2', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 2
          }
        }
      }));
    });
    it('step 3', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 3
          }
        }
      }));
    });
    it('step 4', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 4
          }
        }
      }));
    });
  });

  describe('companyType is LARGE_ENTERPRISES', () => {
    const originState = {
      kyc: {
        kybInfo: {
          verifyStatus: -1
        }
      },
      kyb: {
        companyDetail: {
          companyType: COMPANY_TYPE.LARGE_ENTERPRISES,
          currentPhase: 1,
          name: 'alibaba',
          registrationDate: moment('2019-12-25'),
          code: 'AZ001',
          dutyParagraph: '11111',
          capitalSource: '22222',
          tradeAmount: 't002',
          director: '33333',
          registrationCountry: 'AD',
          registrationProvince: '44444',
          registrationCity: '55555',
          registrationPostcode: '66666',
          registrationStreet: '77777',
          registrationHome: '88888',
          detailSameOfficeAddress: true,
          registrationAttachment: [createFileItem()],
          handleRegistrationAttachment: [createFileItem()],
          // step2
          firstName: 'tony',
          lastName: 'stack',
          middleName: '',
          middleName2: '',
          duty: 'CEO',
          imAccount: 'iconMan',
          detailContactorPhotoType: 'idCard',
          idExpireDate: moment('2035-01-01'),
          frontPhoto: [createFileItem()],
          backPhoto: [createFileItem()],
          handlePhoto: [createFileItem()],
          // step3
          detailDirectorSingle: false,
          boardResolution: [createFileItem()],
          performanceAttachment: [createFileItem()],
          actualController: [createFileItem()],
          equityStructure: [createFileItem()],
          detailOfficialSealAvailable: false,
          unstampedCertificate: [],
          // step4
          directorCertificate: [],
          dueDiligence: []
        }
      }
    }
    it('step 1', async () => {
      customRender(<InstitutionalKycV2 />, originState);
    });
    it('step 2', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 2
          }
        }
      }));
    });
    it('step 3', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 3
          }
        }
      }));
    });
    it('step 4', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 4
          }
        }
      }));
    });
  });

  describe('companyType is INDIVIDUAL_ENTERPRISE', () => {
    const originState = {
      kyc: {
        kybInfo: {
          verifyStatus: -1
        }
      },
      kyb: {
        companyDetail: {
          companyType: COMPANY_TYPE.INDIVIDUAL_ENTERPRISE,
          currentPhase: 1,
          name: 'alibaba',
          registrationDate: moment('2019-12-25'),
          code: 'AZ001',
          dutyParagraph: '11111',
          capitalSource: '22222',
          tradeAmount: 't002',
          director: '33333',
          registrationCountry: 'AD',
          registrationProvince: '44444',
          registrationCity: '55555',
          registrationPostcode: '66666',
          registrationStreet: '77777',
          registrationHome: '88888',
          detailSameOfficeAddress: true,
          registrationAttachment: [createFileItem()],
          handleRegistrationAttachment: [createFileItem()],
          // step2
          firstName: 'tony',
          lastName: 'stack',
          middleName: '',
          middleName2: '',
          duty: 'CEO',
          imAccount: 'iconMan',
          detailContactorPhotoType: 'idCard',
          idExpireDate: moment('2035-01-01'),
          frontPhoto: [createFileItem()],
          backPhoto: [createFileItem()],
          handlePhoto: [createFileItem()],
          // step3
          authorizeAttachment: [createFileItem()],
          performanceAttachment: [createFileItem()],
          detailOfficialSealAvailable: false,
          unstampedCertificate: [],
          // step4
          dueDiligence: [],
          operatorIdentificationCertificate: []
        }
      }
    }
    it('step 1', async () => {
      customRender(<InstitutionalKycV2 />, originState);
    });
    it('step 2', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 2
          }
        }
      }));
    });
    it('step 3', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 3
          }
        }
      }));
    });
    it('step 4', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 4
          }
        }
      }));
    });
  });

  describe('companyType is PARTNERSHIP', () => {
    const originState = {
      kyc: {
        kybInfo: {
          verifyStatus: -1
        }
      },
      kyb: {
        companyDetail: {
          companyType: COMPANY_TYPE.PARTNERSHIP,
          currentPhase: 1,
          name: 'alibaba',
          registrationDate: moment('2019-12-25'),
          code: 'AZ001',
          dutyParagraph: '11111',
          capitalSource: '22222',
          tradeAmount: 't002',
          director: '33333',
          registrationCountry: 'AD',
          registrationProvince: '44444',
          registrationCity: '55555',
          registrationPostcode: '66666',
          registrationStreet: '77777',
          registrationHome: '88888',
          detailSameOfficeAddress: true,
          registrationAttachment: [createFileItem()],
          handleRegistrationAttachment: [createFileItem()],
          // step2
          firstName: 'tony',
          lastName: 'stack',
          middleName: '',
          middleName2: '',
          duty: 'CEO',
          imAccount: 'iconMan',
          detailContactorPhotoType: 'idCard',
          idExpireDate: moment('2035-01-01'),
          frontPhoto: [createFileItem()],
          backPhoto: [createFileItem()],
          handlePhoto: [createFileItem()],
          // step3
          boardResolution: [createFileItem()],
          performanceAttachment: [createFileItem()],
          partnershipAgreement: [createFileItem()],
          partnerID: [createFileItem()],
          detailOfficialSealAvailable: false,
          unstampedCertificate: [],
          // step4
          dueDiligence: [],
          confirmationCapitalContribution: [],
          financialBusinessOperationPermit: []
        }
      }
    }
    it('step 1', async () => {
      customRender(<InstitutionalKycV2 />, originState);
    });
    it('step 2', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 2
          }
        }
      }));
    });
    it('step 3', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 3
          }
        }
      }));
    });
    it('step 4', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 4
          }
        }
      }));
    });
  });

  describe('companyType is FINANCIAL_INSTITUTION', () => {
    const originState = {
      kyc: {
        kybInfo: {
          verifyStatus: -1
        }
      },
      kyb: {
        companyDetail: {
          companyType: COMPANY_TYPE.FINANCIAL_INSTITUTION,
          currentPhase: 1,
          name: 'alibaba',
          registrationDate: moment('2019-12-25'),
          code: 'AZ001',
          dutyParagraph: '11111',
          capitalSource: '22222',
          tradeAmount: 't002',
          director: '33333',
          registrationCountry: 'AD',
          registrationProvince: '44444',
          registrationCity: '55555',
          registrationPostcode: '66666',
          registrationStreet: '77777',
          registrationHome: '88888',
          detailSameOfficeAddress: true,
          registrationAttachment: [createFileItem()],
          handleRegistrationAttachment: [createFileItem()],
          // step2
          firstName: 'tony',
          lastName: 'stack',
          middleName: '',
          middleName2: '',
          duty: 'CEO',
          imAccount: 'iconMan',
          detailContactorPhotoType: 'idCard',
          idExpireDate: moment('2035-01-01'),
          frontPhoto: [createFileItem()],
          backPhoto: [createFileItem()],
          handlePhoto: [createFileItem()],
          // step3
          detailDirectorSingle: false,
          boardResolution: [createFileItem()],
          directorAttachment: [createFileItem()],
          directorCertificate: [createFileItem()],
          performanceAttachment: [createFileItem()],
          shareholdersAttachment: [createFileItem()],
          detailIndividualShareholdersRatio: false,
          detailInstitutionShareholdersRatio: false,
          equityStructure: [createFileItem()],
          detailOfficialSealAvailable: false,
          unstampedCertificate: [],
          // step4
          directorAttachment: [],
          dueDiligence: [],
          financialBusinessOperationPermit: []
        }
      }
    }
    it('step 1', async () => {
      customRender(<InstitutionalKycV2 />, originState);
    });
    it('step 2', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 2
          }
        }
      }));
    });
    it('step 3', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 3
          }
        }
      }));
    });
    it('step 4', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 4
          }
        }
      }));
    });
  });

  describe('companyType is OTHER', () => {
    const originState = {
      kyc: {
        kybInfo: {
          verifyStatus: -1
        }
      },
      kyb: {
        companyDetail: {
          companyType: COMPANY_TYPE.OTHER,
          currentPhase: 1,
          name: 'alibaba',
          registrationDate: moment('2019-12-25'),
          code: 'AZ001',
          dutyParagraph: '11111',
          capitalSource: '22222',
          tradeAmount: 't002',
          director: '33333',
          registrationCountry: 'AD',
          registrationProvince: '44444',
          registrationCity: '55555',
          registrationPostcode: '66666',
          registrationStreet: '77777',
          registrationHome: '88888',
          detailSameOfficeAddress: true,
          registrationAttachment: [createFileItem()],
          handleRegistrationAttachment: [createFileItem()],
          // step2
          firstName: 'tony',
          lastName: 'stack',
          middleName: '',
          middleName2: '',
          duty: 'CEO',
          imAccount: 'iconMan',
          detailContactorPhotoType: 'idCard',
          idExpireDate: moment('2035-01-01'),
          frontPhoto: [createFileItem()],
          backPhoto: [createFileItem()],
          handlePhoto: [createFileItem()],
          // step3
          detailDirectorSingle: false,
          boardResolution: [createFileItem()],
          performanceAttachment: [createFileItem()],
          dueDiligence: [createFileItem()],
          partnerID: [createFileItem()],
          proofFundingSource: [createFileItem()],
          detailOfficialSealAvailable: false,
          unstampedCertificate: [],
          // step4
          directorAttachment: [],
          directorCertificate: [],
          shareholdersAttachment: [],
          detailIndividualShareholdersRatio: false,
          actualController: [],
          detailInstitutionShareholdersRatio: false,
          shareholdingExceedsOneFourth: []
        }
      }
    }
    it('step 1', async () => {
      customRender(<InstitutionalKycV2 />, originState);
    });
    it('step 2', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 2
          }
        }
      }));
    });
    it('step 3', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 3
          }
        }
      }));
    });
    it('step 4', async () => {
      customRender(<InstitutionalKycV2 />, merge({}, originState, {
        kyb: {
          companyDetail: {
            currentPhase: 4
          }
        }
      }));
    });
  });
})