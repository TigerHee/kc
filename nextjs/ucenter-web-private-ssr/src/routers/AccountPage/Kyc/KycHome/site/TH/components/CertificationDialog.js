/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRightOutlined, ICCopyOutlined } from '@kux/icons';
import { Button, css, Dialog, Drawer, styled, useSnackbar, useTheme } from '@kux/mui';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import CertificationIcon from 'static/account/kyc/th/certification_icon.svg';
import CertificationIconDark from 'static/account/kyc/th/certification_icon_dark.svg';
import IdCardIcon from 'static/account/kyc/th/id_card.svg';
// import ThaiIdIcon from 'static/account/kyc/th/ThaID.svg';
import NdidIcon from 'static/account/kyc/th/NDID.svg';
import PassportIcon from 'static/account/kyc/th/passport.svg';
import step1Src from 'static/account/kyc/th/step1.svg';
import step2Src from 'static/account/kyc/th/step2.svg';
import step3Src from 'static/account/kyc/th/step3.svg';
import { _t, _tHTML } from 'tools/i18n';
// TODO:MULTI_SITE
import { getCurrentLang } from 'kc-next/i18n';
import { getComplianceConfig, recordSelect } from 'src/services/kyc_th';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const DOWNLOAD_APP_URL = 'https://kucointh.onelink.me/AiYm/h4niawn1';

const qrCodeImageSettings = {
  src: window._BRAND_LOGO_MINI_,
  x: null,
  y: null,
  height: 25,
  width: 25,
  excavate: true,
};

const CopyIcon = styled(ICCopyOutlined)`
  cursor: pointer;
`;

const ArrowIcon = styled(ICArrowRightOutlined)`
  color: ${({ theme }) => theme.colors.icon60};
`;

const STEPS = {
  /** 企业 */
  ENTITY: 'ENTITY',
  /** 个人 - 推荐下载app */
  INDIVIDUAL_DOWNLOAD: 'INDIVIDUAL_DOWNLOAD',
  /** 个人 - 继续操作 - 选国籍 */
  INDIVIDUAL_SELECT_CITIZENSHIP: 'INDIVIDUAL_SELECT_CITIZENSHIP',
  /** 个人 - 非泰国 - 步骤预览 */
  INDIVIDUAL_FOREIGN_STEPS: 'INDIVIDUAL_FOREIGN_STEPS',
  /** 个人 - 泰国 - 认证方式选择 */
  INDIVIDUAL_THAI: 'INDIVIDUAL_THAI',
  /** 个人 - 泰国 - 步骤预览 */
  INDIVIDUAL_THAI_STEPS: 'INDIVIDUAL_THAI_STEPS',
};

const ExDialog = styled(Dialog)``;

const ExDrawer = styled(Drawer)`
  z-index: 999;
  border-radius: 12px 12px 0 0;
  .KuxDrawer-content {
    padding: 20px 16px 0;
  }
`;

const PreselectDialog = styled(Dialog)`
  .KuxDialog-content {
    margin-top: -36px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KuxDialog-basic {
      max-width: 319px;
    }
  }
`;

const StepChoose = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  text-align: center;
  padding-bottom: 32px;
  > img {
    display: block;
    margin: 0 auto;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
    > img {
      margin-bottom: 8px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  > button {
    display: inline-block;
    flex: 1;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 32px;
  }
`;

const EntityDesc = styled.div`
  font-size: 16px;
  line-height: 130%;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text60};
`;

const EntityCopyBox = styled.div`
  padding: 16px;
  margin: 16px 0 24px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.cover2};
  > div {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
  }
`;

const EntityTermTitle = styled.div`
  font-size: 15px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text60};
  b {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const QRCodeWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 40px;
  }
`;

const QRCodeDesc = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 20px;
`;

const LineWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 32px;
  width: 100%;
`;
const Line = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.divider8};
  flex: 1;
`;
const LineText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  text-align: center;
  margin: 0 16px;
  color: ${({ theme }) => theme.colors.text30};
`;

const Continue = styled.div`
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  text-decoration: underline;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

const SelectCitizenshipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 24px 0 32px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px;
  }
`;

const SelectCitizenshipItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  .text {
    flex: 1;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    > img {
      width: 40px;
    }
    .text {
      font-size: 14px;
    }
  }
`;

const CommonContainer = styled.div`
  height: 590px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: calc(100vh - 32px - 56px - 20px);
  }
`;

const CommonContent = styled.div`
  flex: 1;
  padding-bottom: 32px;
`;

const CommonFooter = styled.div`
  height: 80px;
  padding: 20px 32px;
  margin: 0 -32px;
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => theme.colors.cover12};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 20px;
    margin: 0 -16px;
    padding: 20px 16px;
  }
  .KuxButton-text {
    color: ${({ theme }) => theme.colors.text60};
  }
`;

const Includes = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  margin: 24px 0 16px;
`;

const Step = styled.div`
  margin-top: 8px;
`;

const StepTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StepContent = styled.div`
  margin-top: 8px;
  margin-left: 10px;
  padding-left: 21px;
  position: relative;
  border-left: 1px dashed
    ${({ theme, isLastOne }) => (isLastOne ? 'transparent' : theme.colors.cover12)};
  padding-bottom: ${({ isLastOne }) => (isLastOne ? '0' : '28px')};
`;

const StepDesc = styled.div`
  padding-left: 12px;
  position: relative;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  &::after {
    position: absolute;
    top: 8.5px;
    left: 0;
    width: 4px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.icon60};
    border-radius: 50%;
    content: '';
  }
`;

const VerificationMethodGroup = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px;
  }
`;

const VerificationMethod = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  border-radius: 8px;
  padding: 24px 20px;
  cursor: pointer;
`;

const VerificationMethodTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;

  .text {
    flex: 1;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 13.5px;
    > img {
      width: 40px;
    }
  }
`;

const VerificationMethodContent = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text40};
`;

const KC_EMAIL = 'kyb@kucoin.th';

const ENTITY_VERIFICATION_TERMS = (isTH) => [
  {
    text: () =>
      isTH ? <b>บริษัทที่จดทะเบียนในประเทศไทย: </b> : <b>Thai-incorporated entities:</b>,
    ordered: true,
    children: [
      {
        text: () =>
          isTH ? (
            <span>เอกสารของบริษัท (ออกโดยกรมพัฒนาธุรกิจการค้า ภายในระยะเวลาไม่เกิน 6 เดือน)</span>
          ) : (
            <span>
              Company Documents (Issued by the Department of Business Development within the past 6
              months):
            </span>
          ),
        children: [
          {
            text: () =>
              isTH ? (
                <span>หนังสือรับรองการจดทะเบียนบริษัท</span>
              ) : (
                <span>Certificate of Company Registration</span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>หนังสือบริคณห์สนธิ (แบบฟอร์ม บอจ.2)</span>
              ) : (
                <span>Memorandum of Association (Form Bor.Jor. 2)</span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>รายการจดทะเบียนบริษัท (แบบฟอร์ม บอจ.3)</span>
              ) : (
                <span>Company Registration Details (Form Bor.Jor. 3)</span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>รายชื่อผู้ถือหุ้น (แบบฟอร์ม บอจ.5)</span>
              ) : (
                <span>List of Shareholders (Form Bor.Jor. 5)</span>
              ),
          },
        ],
      },
      {
        text: () =>
          isTH ? (
            <span>เอกสารยืนยันตัวตนของกรรมการผู้มีอำนาจ</span>
          ) : (
            <span>Identification Document of the Authorized Company Director:</span>
          ),
        children: [
          {
            text: () =>
              isTH ? (
                <span>สำเนาบัตรประชาชน ด้านหน้าเท่านั้น พร้อมลงลายมือชื่อรับรองสำเนาถูกต้อง</span>
              ) : (
                <span>
                  For a Thai national authorized director, a certified true copy of the national
                  identification card (front side only).
                </span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>
                  สำหรับกรรมการที่มีอำนาจลงนามซึ่งไม่มีสัญชาติไทย ให้ใช้
                  สำเนาหนังสือเดินทางพร้อมลงลายมือชื่อรับรองสำเนาถูกต้องข้อมูลบัญชีธนาคารของบริษัท
                </span>
              ) : (
                <span>
                  For a non-Thai national authorized director, a certified true copy of the
                  passport.
                </span>
              ),
          },
        ],
      },
      {
        text: () =>
          isTH ? (
            <span>ข้อมูลบัญชีธนาคารของบริษัท </span>
          ) : (
            <span>Company Bank Account Details:</span>
          ),
        children: isTH
          ? [
            {
              text: () => (
                <span>
                  สำเนาสมุดบัญชีธนาคารไทยของบริษัท (แสดงชื่อบริษัทและเลขที่บัญชี)
                  (กรณีต้องการฝากหรือถอนเงินผ่านธนาคาร)
                </span>
              ),
            },
          ]
          : [
            {
              text: () => (
                <span>
                  Certified true copy of the company’s Thai bank passbook showing the account name
                  and account number (required if the company intends to make deposits or
                  withdrawals via bank transfer)
                </span>
              ),
            },
          ],
      },
      {
        text: () => (isTH ? <span>ข้อมูลทางการเงิน</span> : <span>Financial Documents:</span>),
        children: [
          {
            text: () =>
              isTH ? (
                <span>งบการเงินที่ผ่านการตรวจสอบประจำปีล่าสุด</span>
              ) : (
                <span>Most recent audited financial statements</span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>
                  กรณีบริษัทที่จัดตั้งใหม่: กรุณาแนบรายการเดินบัญชีธนาคารของบริษัทย้อนหลัง 6 เดือน
                  หรือเอกสารอื่นที่แสดง
                </span>
              ) : (
                <span>
                  Company’s bank statements for the past 6 months or other documents showing the
                  source of funds or capital as a substitute.
                </span>
              ),
          },
        ],
      },
      {
        text: () =>
          isTH ? <span>มติคณะกรรมการบริษัท</span> : <span>Company Board Resolution: </span>,
        children: [
          {
            text: () =>
              isTH ? (
                <span>
                  รายงานการประชุมที่อนุมัติการเปิดบัญชีกับ KuCoin Thailand ซึ่งดำเนินการโดยบริษัท
                  อีอาร์เอ็กซ์ จำกัด โดยต้องระบุชื่อผู้ติดต่อที่ได้รับมอบหมาย
                  (ไม่จำเป็นต้องใช้หากบริษัทมีกรรมการผู้มีอำนาจเพียงคนเดียว)
                </span>
              ) : (
                <span>
                  A copy of the board meeting minutes approving the opening of an account with
                  KuCoin Thailand (operated by ERX Company Limited), clearly stating the name of the
                  designated contact person. This document is not required if the company has only
                  one authorized director.
                </span>
              ),
          },
        ],
      },
    ],
  },
  {
    text: () =>
      isTH ? <b>บริษัทที่จดทะเบียนนอกประเทศไทย:</b> : <b>Non-Thai incorporated entities:</b>,
    ordered: true,
    children: [
      {
        text: () =>
          isTH ? (
            <span>
              เอกสารของบริษัท (ออกโดยหน่วยงานในประเทศที่จดทะเบียนบริษัท ภายในระยะเวลาไม่เกิน 6
              เดือน)
            </span>
          ) : (
            <span>
              Company Documents (Issued by the country of incorporation and dated within the last 6
              months):
            </span>
          ),
        children: isTH
          ? [
            {
              text: () => (
                <span>
                  หนังสือรับรองการจดทะเบียนบริษัท หรือ หนังสือบริคณห์สนธิ (Certificate of Company
                  Registration or Company Affidavit){' '}
                </span>
              ),
            },
            { text: () => <span>รายการจดทะเบียนบริษัท (Memorandum of Association) </span> },
            { text: () => <span>รายชื่อผู้ถือหุ้น </span> },
          ]
          : [
            { text: () => <span>Certificate of Company Registration</span> },
            { text: () => <span>Company Affidavit</span> },
            { text: () => <span>Memorandum of Association</span> },
            { text: () => <span>List of Shareholders </span> },
          ],
      },
      {
        text: () =>
          isTH ? (
            <span>เอกสารยืนยันตัวตนของกรรมการผู้มีอำนาจ </span>
          ) : (
            <span>Identification Document of the Authorized Company Director:</span>
          ),
        children: [
          {
            text: () =>
              isTH ? (
                <span>
                  สำเนาหนังสือเดินทาง (สำหรับกรรมการที่มีอำนาจลงนามที่ไม่มีสัญชาติไทย)
                  พร้อมลงลายมือชื่อ{' '}
                </span>
              ) : (
                <span>
                  For a Thai national authorized director, a certified true copy of the national
                  identification card (front side only).
                </span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>
                  สำเนาบัตรประชาชน (สำหรับกรรมการที่มีอำนาจลงนามที่มีสัญชาติไทย) พร้อมลงลายมือชื่อ
                </span>
              ) : (
                <span>
                  For a non-Thai national authorized director, a certified true copy of the
                  passport.
                </span>
              ),
          },
        ],
      },
      {
        text: () =>
          isTH ? (
            <span>ข้อมูลบัญชีธนาคารของบริษัท </span>
          ) : (
            <span>Company Bank Account Details:</span>
          ),
        children: [
          {
            text: () =>
              isTH ? (
                <span>
                  สำเนาสมุดบัญชีธนาคารไทยของบริษัท (แสดงชื่อบริษัทและเลขที่บัญชี)
                  (กรณีต้องการฝากหรือถอนเงินผ่านธนาคาร)
                </span>
              ) : (
                <span>
                  Certified true copy of the company’s Thai bank passbook showing the account name
                  and account number (required if the company intends to make deposits or
                  withdrawals via bank transfer)
                </span>
              ),
          },
        ],
      },
      {
        text: () => (isTH ? <span>ข้อมูลทางการเงิน</span> : <span>Financial Documents:</span>),
        children: [
          {
            text: () =>
              isTH ? (
                <span>งบการเงินที่ผ่านการตรวจสอบล่าสุด </span>
              ) : (
                <span>Most recent audited financial statements</span>
              ),
          },
          {
            text: () =>
              isTH ? (
                <span>
                  รายการเดินบัญชีธนาคารของบริษัทย้อนหลัง 6 เดือน
                  หรือเอกสารอื่นที่แสดงแหล่งที่มาของเงินได้หรือเงินทุน
                </span>
              ) : (
                <span>
                  Company’s bank statements for the past 6 months or other documents showing the
                  source of funds or capital as a substitute.
                </span>
              ),
          },
        ],
      },
      {
        text: () =>
          isTH ? <span>มติคณะกรรมการบริษัท </span> : <span>Company Board Resolution: </span>,
        children: [
          {
            text: () =>
              isTH ? (
                <span>
                  รายงานการประชุมที่อนุมัติการเปิดบัญชีกับ KuCoin Thailand ซึ่งดำเนินการโดยบริษัท
                  อีอาร์เอ็กกซ์ จำกัด โดยต้องระบุชื่อผู้ติดต่อที่ได้รับมอบหมาย
                  (ไม่จำเป็นต้องใช้หากบริษัทมีกรรมการผู้มีอำนาจเพียงคนเดียว){' '}
                </span>
              ) : (
                <span>
                  A copy of the board meeting minutes approving the opening of an account with
                  KuCoin Thailand (operated by ERX Company Limited), clearly stating the name of the
                  designated contact person. This document is not required if the company has only
                  one authorized director.
                </span>
              ),
          },
        ],
      },
    ],
  },
  {
    text: () =>
      isTH ? (
        <>
          <b>*หมายเหตุ: </b>
          <span>
            เอกสารทั้งหมดจะต้องได้รับการรับรองโดย โนตารีพับลิก (Notary Public)
            ทั้งนี้หากกฎหมายในประเทศของท่านอนุญาตให้ สถาบันการเงิน หรือ หน่วยงานที่ได้รับอนุญาต
            สามารถรับรองเอกสารได้โดยเทียบเท่ากับโนตารีพับลิก
            ท่านสามารถใช้การรับรองจากหน่วยงานดังกล่าวแทนได้ หรือ
            รับรองโดยสถานเอกอัครราชทูตหรือสถานกงสุลไทยประจำประเทศที่มีการจัดตั้งบริษัท
          </span>
        </>
      ) : (
        <>
          <b>*Note: </b>
          <span>
            All documents must be notarized by a Notary Public. However, if the laws of your country
            permit financial institutions or license service providers to certify documents with
            legal equivalence to notarization by a Notary Public, such certification shall be deemed
            acceptable. Alternatively, documents may also be certified by the Royal Thai Embassy or
            Consular in the country where the company is incorporated.
          </span>
        </>
      ),
  },
];

const ListThai = [
  {
    logo: step1Src,
    title: _t('1c42f759dc614000a194'),
    requires: [_t('4ec354e98fd54000ac22'), _t('831b31384be54000add1')],
  },
  {
    logo: step2Src,
    title: _t('5e79a9b9caf64000a6f5'),
    requires: [_t('9f511f5c03444000a634'), _t('615504b817604000a141')],
  },
  {
    logo: step3Src,
    title: _t('c67f59ca835c4000a69a'),
    requires: [_t('41bf3f8afb734000ade1')],
  },
];

const ListForeign = [
  {
    logo: step1Src,
    title: _t('1c42f759dc614000a194'),
    requires: [_t('90cfa1fecf574000a2fd')],
  },
  {
    logo: step2Src,
    title: _t('5e79a9b9caf64000a6f5'),
    requires: [_t('f754ff4084454000ae7c'), _t('690626bf2d624000ab30')],
  },
  {
    logo: step3Src,
    title: _t('c67f59ca835c4000a69a'),
    requires: [_t('41bf3f8afb734000ade1')],
  },
];

const COMPLIANCE_METHOD = {
  THAI_ID: 'kycStandardThaiId',
  NDID: 'kycStandardNdId',
  FOREIGN: 'kycStandardThForeign',
};

const ListVerificationMethod = [
  // {
  //   logo: ThaiIdIcon,
  //   title: 'ThaID',
  //   desc: _t('627683ae1b544000ae20'),
  //   value: COMPLIANCE_METHOD.THAI_ID,
  // },
  {
    logo: NdidIcon,
    title: 'NDID',
    desc: _t('b06198c3fb194000a709'),
    value: COMPLIANCE_METHOD.NDID,
  },
];

export default function CertificationDialog({ open, onCancel, onCompliance }) {
  const [preselectDialogOpen, setPreselectDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [step, setStep] = useState(STEPS.ENTITY);
  const verificationMethodRef = useRef('');
  const { currentTheme } = useTheme();
  const { message } = useSnackbar();
  const [isForeign, setIsForeign] = useState(false);

  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;

  useEffect(() => {
    if (open) {
      setPreselectDialogOpen(true);
    } else {
      setPreselectDialogOpen(false);
      setStep(STEPS.ENTITY);
    }
    setDialogOpen(false);
  }, [open]);

  const handleCompliance = useCallback(
    async (method) => {
      let standardAlias = '';
      try {
        const { success, data } = await getComplianceConfig();
        if (success) {
          standardAlias = data?.standardAliasMap?.[method];
        }
      } catch (err) {
        return message.error(err.message);
      }

      try {
        const { success } = await recordSelect({
          standardAlias,
          kycType: 1,
        });

        if (success) {
          onCompliance(standardAlias);
        }
      } catch (err) {
        message.error(err.message);
      }
    },
    [onCompliance, message],
  );

  const isDark = useMemo(() => currentTheme === 'dark', [currentTheme]);
  const currentLang = getCurrentLang();

  const { title = _t('kyc.certification.personal'), content = null } = useMemo(() => {
    const renderList = (list, ordered = false, index = 0) => {
      const renderLi = (item) => {
        const _text = item.text();
        return (
          <li>
            <span>{_text}</span>
            {item.children?.length ? renderList(item.children, item.listStyle, index + 1) : null}
          </li>
        );
      };
      const commonStyle = {
        marginBottom: index < 1 ? 12 : 0,
        paddingLeft: '1em',
        fontSize: 15,
        lineHeight: '150%',
        fontWeight: 400,
      };
      return ordered ? (
        <ol style={{ listStyle: 'decimal', ...commonStyle }}>{list.map(renderLi)}</ol>
      ) : (
        <ul style={{ listStyle: 'disc', ...commonStyle }}>{list.map(renderLi)}</ul>
      );
    };
    return (
      {
        // KYB 代客提交提示页面
        [STEPS.ENTITY]: {
          title: _t('1cf6fd1fbae84000a269'),
          content: (
            <CommonContainer style={{ overflow: 'auto' }}>
              <CommonContent>
                <EntityDesc>{_t('70cdc8bacc774000a391')}</EntityDesc>
                <EntityCopyBox>
                  <div>{KC_EMAIL}</div>
                  <CopyToClipboard
                    text={KC_EMAIL}
                    onCopy={() => {
                      message.success(_t('copy.succeed'));
                    }}
                  >
                    <CopyIcon size={16} />
                  </CopyToClipboard>
                </EntityCopyBox>
                {ENTITY_VERIFICATION_TERMS(currentLang === 'th_TH').map((term) => {
                  const _text = term.text();
                  return (
                    <div key={`content_${_text}`}>
                      <EntityTermTitle>{_text}</EntityTermTitle>
                      {term.children?.length ? renderList(term.children, term.ordered) : null}
                    </div>
                  );
                })}
              </CommonContent>
            </CommonContainer>
          ),
        },
        // 下载 APP 页面
        [STEPS.INDIVIDUAL_DOWNLOAD]: {
          title: _t('s1bz5tJYQweg86RnuEF6ye'),
          content: (
            <CommonContainer>
              {isForeign ? (
                <Desc>{_t('842798b5136b4000a383')}</Desc>
              ) : (
                <Desc>{_t('4ubZFUStHWQxhgx2ry97yJ')}</Desc>
              )}

              <QRCodeWrapper>
                <QRCodeSVG
                  value={DOWNLOAD_APP_URL}
                  imageSettings={qrCodeImageSettings}
                  size={153}
                  level="M"
                />
                <QRCodeDesc>{_t('kzkkdFNyF1pJjKhMyTzekX')}</QRCodeDesc>

                {isForeign ? null : (
                  <>
                    <LineWrapper>
                      <Line />
                      <LineText>{_t('7QSMua73QMovhgsX5NYgUc')}</LineText>
                      <Line />
                    </LineWrapper>
                    <Continue onClick={() => setStep(STEPS.INDIVIDUAL_THAI)}>
                      {_t('eQojERUsdT2Tm5zdTmiFT6')}
                    </Continue>
                  </>
                )}
              </QRCodeWrapper>
            </CommonContainer>
          ),
        },
        // 个人 - 继续操作 - 选国籍
        [STEPS.INDIVIDUAL_SELECT_CITIZENSHIP]: {
          content: (
            <CommonContainer>
              <Title>{_t('4ece38a0a3ac4000a90e')}</Title>
              <Desc>{_t('857075a8c2db4000a38b')}</Desc>
              <SelectCitizenshipWrapper>
                <SelectCitizenshipItem
                  onClick={() => {
                    setIsForeign(false);
                    setStep(STEPS.INDIVIDUAL_DOWNLOAD);
                  }}
                >
                  <img alt="id_card icon" src={IdCardIcon} />
                  <div className="text">{_t('819e7137e9394000a95d')}</div>
                  <ArrowIcon size={20} />
                </SelectCitizenshipItem>
                <SelectCitizenshipItem
                  onClick={() => {
                    setIsForeign(true);
                    setStep(STEPS.INDIVIDUAL_DOWNLOAD);
                  }}
                >
                  <img alt="passport icon" src={PassportIcon} />
                  <div className="text">{_t('e9bc5e12a5714000a4e7')}</div>
                  <ArrowIcon size={20} />
                </SelectCitizenshipItem>
              </SelectCitizenshipWrapper>
            </CommonContainer>
          ),
        },
        // 个人 - 泰国 - 认证方式选择
        [STEPS.INDIVIDUAL_THAI]: {
          content: (
            <CommonContainer>
              <CommonContent>
                <Title>{_t('a6eb33e256bc4000a6eb')}</Title>
                <Desc>{_t('857075a8c2db4000a38b')}</Desc>
                <VerificationMethodGroup>
                  {ListVerificationMethod.map(({ title, logo, desc, value }) => (
                    <VerificationMethod
                      key={value}
                      onClick={() => {
                        verificationMethodRef.current = value;
                        setStep(STEPS.INDIVIDUAL_THAI_STEPS);
                      }}
                    >
                      <VerificationMethodTitle>
                        <img alt={`icon ${title}`} src={logo} />
                        <div className="text">{title}</div>
                        <ArrowIcon size={20} />
                      </VerificationMethodTitle>
                      <VerificationMethodContent>{desc}</VerificationMethodContent>
                    </VerificationMethod>
                  ))}
                </VerificationMethodGroup>
              </CommonContent>
              <CommonFooter>
                <Button variant="text" onClick={() => setStep(STEPS.INDIVIDUAL_SELECT_CITIZENSHIP)}>
                  {_t('8770133f135e4000a1de')}
                </Button>
              </CommonFooter>
            </CommonContainer>
          ),
        },
        // 个人 - 泰国 - 步骤预览
        [STEPS.INDIVIDUAL_THAI_STEPS]: {
          content: (
            <CommonContainer>
              <CommonContent>
                <Title>{_t('3f421e4f183d4000aa1d')}</Title>
                <Desc>{_t('df4226c87db54000a4e5')}</Desc>
                <Includes>{_t('e1fac51415ce4000ac47')}</Includes>
                {ListThai.map(({ logo, title, requires }, index) => (
                  <Step key={title}>
                    <StepTitle>
                      <img alt="icon step" src={logo} />
                      <div>{title}</div>
                    </StepTitle>
                    <StepContent isLastOne={index === ListForeign.length - 1}>
                      {requires.map((r) => (
                        <StepDesc key={r}>{r}</StepDesc>
                      ))}
                    </StepContent>
                  </Step>
                ))}
              </CommonContent>
              <CommonFooter>
                <Button variant="text" onClick={() => setStep(STEPS.INDIVIDUAL_THAI)}>
                  {_t('8770133f135e4000a1de')}
                </Button>
                <Button onClick={() => handleCompliance(verificationMethodRef.current)}>
                  {_t('continue')}
                </Button>
              </CommonFooter>
            </CommonContainer>
          ),
        },
        // 个人 - 外国人- 步骤预览
        [STEPS.INDIVIDUAL_FOREIGN_STEPS]: {
          content: (
            <CommonContainer>
              <CommonContent>
                <Title>{_t('3f421e4f183d4000aa1d')}</Title>
                <Desc>{_t('df4226c87db54000a4e5')}</Desc>
                <Includes>{_t('e1fac51415ce4000ac47')}</Includes>
                {ListForeign.map(({ logo, title, requires }, index) => (
                  <Step key={title}>
                    <StepTitle>
                      <img alt="icon step" src={logo} />
                      <div>{title}</div>
                    </StepTitle>
                    <StepContent isLastOne={index === ListForeign.length - 1}>
                      {requires.map((r) => (
                        <StepDesc key={r}>{r}</StepDesc>
                      ))}
                    </StepContent>
                  </Step>
                ))}
              </CommonContent>
              <CommonFooter>
                <Button variant="text" onClick={() => setStep(STEPS.INDIVIDUAL_SELECT_CITIZENSHIP)}>
                  {_t('8770133f135e4000a1de')}
                </Button>
                <Button onClick={() => handleCompliance(COMPLIANCE_METHOD.FOREIGN)}>
                  {_t('continue')}
                </Button>
              </CommonFooter>
            </CommonContainer>
          ),
        },
      }[step] ?? {}
    );
  }, [step, isH5, isForeign]);

  return (
    <>
      <PreselectDialog
        open={open && preselectDialogOpen}
        title={null}
        footer={null}
        onCancel={onCancel}
        destroyOnClose
      >
        <StepChoose>
          <img alt="icon" src={isDark ? CertificationIconDark : CertificationIcon} />
          <div>{_tHTML('c77475e457a74000a45f')}</div>
          <ButtonGroup>
            <Button
              className="ellipsis"
              variant="outlined"
              onClick={() => {
                setStep(STEPS.ENTITY);
                setPreselectDialogOpen(false);
                setDialogOpen(true);
              }}
            >
              {_t('2268131fde024000a0d2')}
            </Button>
            <Button
              className="ellipsis"
              onClick={() => {
                setStep(STEPS.INDIVIDUAL_SELECT_CITIZENSHIP);
                setPreselectDialogOpen(false);
                setDialogOpen(true);
              }}
            >
              {_t('8b433f7ef4b84000af18')}
            </Button>
          </ButtonGroup>
        </StepChoose>
      </PreselectDialog>
      {isH5 ? (
        <ExDrawer
          className="thKycDrawer"
          anchor="bottom"
          show={open && dialogOpen}
          title={title}
          back={false}
          onClose={onCancel}
        >
          {content}
        </ExDrawer>
      ) : (
        <ExDialog
          css={css`
            z-index: 999;
          `}
          size="large"
          title={title}
          footer={null}
          open={open && dialogOpen}
          onCancel={onCancel}
          destroyOnClose
        >
          {content}
        </ExDialog>
      )}
    </>
  );
}
