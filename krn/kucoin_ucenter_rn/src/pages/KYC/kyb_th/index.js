import {LeftSlot, MHeaderMajor} from 'components/Common/NavIcons';
import useLang from 'hooks/useLang';
import {
  Body,
  Main,
  Title,
  Intro,
  EmailBox,
  EmailText,
  CopyIcon,
  ContentTitle,
  B,
} from './style';
import React, {useState, useMemo} from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Clipboard,
  SafeAreaView,
  View,
} from 'react-native';
import useIconSrc from 'hooks/useIconSrc';
import {showToast} from '@krn/bridge';
import {DEFAULT_LANG, languages} from 'config';
import {getNativeInfo} from 'utils/helper';
import {useMount} from 'react-use';

const EMAIL = 'vip@kucoin.th';

export default () => {
  const {_t} = useLang();
  const [lang, setLang] = useState(DEFAULT_LANG);
  const isTH = lang === 'th_TH';

  // 获取语言
  useMount(async () => {
    const nativeInfo = await getNativeInfo();
    // 设置语言
    if (languages.some(i => i === nativeInfo.lang)) {
      setLang(nativeInfo.lang);
    }
  });

  const terms = useMemo(
    () => [
      {
        text: isTH ? (
          <B>บริษัทที่จดทะเบียนในประเทศไทย: </B>
        ) : (
          <B>Thai-incorporated entities:</B>
        ),
        ordered: true,
        children: [
          {
            text: isTH ? (
              <Text>
                เอกสารของบริษัท (ออกโดยกรมพัฒนาธุรกิจการค้า ภายในระยะเวลาไม่เกิน
                6 เดือน)
              </Text>
            ) : (
              <Text>
                Company Documents (Issued by the Department of Business
                Development within the past 6 months):
              </Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>หนังสือรับรองการจดทะเบียนบริษัท</Text>
                ) : (
                  <Text>Certificate of Company Registration</Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>หนังสือบริคณห์สนธิ (แบบฟอร์ม บอจ.2)</Text>
                ) : (
                  <Text>Memorandum of Association (Form Bor.Jor. 2)</Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>รายการจดทะเบียนบริษัท (แบบฟอร์ม บอจ.3)</Text>
                ) : (
                  <Text>Company Registration Details (Form Bor.Jor. 3)</Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>รายชื่อผู้ถือหุ้น (แบบฟอร์ม บอจ.5)</Text>
                ) : (
                  <Text>List of Shareholders (Form Bor.Jor. 5)</Text>
                ),
              },
            ],
          },
          {
            text: isTH ? (
              <Text>เอกสารยืนยันตัวตนของกรรมการผู้มีอำนาจ</Text>
            ) : (
              <Text>
                Identification Document of the Authorized Company Director:
              </Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>
                    สำเนาบัตรประชาชน ด้านหน้าเท่านั้น
                    พร้อมลงลายมือชื่อรับรองสำเนาถูกต้อง
                  </Text>
                ) : (
                  <Text>
                    For a Thai national authorized director, a certified true
                    copy of the national identification card (front side only).
                  </Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>
                    สำหรับกรรมการที่มีอำนาจลงนามซึ่งไม่มีสัญชาติไทย ให้ใช้
                    สำเนาหนังสือเดินทางพร้อมลงลายมือชื่อรับรองสำเนาถูกต้องข้อมูลบัญชีธนาคารของบริษัท
                  </Text>
                ) : (
                  <Text>
                    For a non-Thai national authorized director, a certified
                    true copy of the passport.
                  </Text>
                ),
              },
            ],
          },
          {
            text: isTH ? (
              <Text>ข้อมูลบัญชีธนาคารของบริษัท</Text>
            ) : (
              <Text>Company Bank Account Details:</Text>
            ),
            children: isTH
              ? [
                  {
                    text: (
                      <Text>
                        สำเนาสมุดบัญชีธนาคารไทยของบริษัท
                        (แสดงชื่อบริษัทและเลขที่บัญชี)
                        (กรณีต้องการฝากหรือถอนเงินผ่านธนาคาร)
                      </Text>
                    ),
                  },
                ]
              : [
                  {
                    text: (
                      <Text>
                        Certified true copy of the company’s Thai bank passbook
                        showing the account name and account number (required if
                        the company intends to make deposits or withdrawals via
                        bank transfer)
                      </Text>
                    ),
                  },
                ],
          },
          {
            text: isTH ? (
              <Text>ข้อมูลทางการเงิน</Text>
            ) : (
              <Text>Financial Documents:</Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>งบการเงินที่ผ่านการตรวจสอบประจำปีล่าสุด</Text>
                ) : (
                  <Text>Most recent audited financial statements</Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>
                    กรณีบริษัทที่จัดตั้งใหม่:
                    กรุณาแนบรายการเดินบัญชีธนาคารของบริษัทย้อนหลัง 6 เดือน
                    หรือเอกสารอื่นที่แสดง
                  </Text>
                ) : (
                  <Text>
                    Company’s bank statements for the past 6 months or other
                    documents showing the source of funds or capital as a
                    substitute.
                  </Text>
                ),
              },
            ],
          },
          {
            text: isTH ? (
              <Text>มติคณะกรรมการบริษัท</Text>
            ) : (
              <Text>Company Board Resolution: </Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>
                    รายงานการประชุมที่อนุมัติการเปิดบัญชีกับ KuCoin Thailand
                    ซึ่งดำเนินการโดยบริษัท อีอาร์เอ็กซ์ จำกัด
                    โดยต้องระบุชื่อผู้ติดต่อที่ได้รับมอบหมาย
                    (ไม่จำเป็นต้องใช้หากบริษัทมีกรรมการผู้มีอำนาจเพียงคนเดียว)
                  </Text>
                ) : (
                  <Text>
                    A copy of the board meeting minutes approving the opening of
                    an account with KuCoin Thailand (operated by ERX Company
                    Limited), clearly stating the name of the designated contact
                    person. This document is not required if the company has
                    only one authorized director.
                  </Text>
                ),
              },
            ],
          },
        ],
      },
      {
        text: isTH ? (
          <B>บริษัทที่จดทะเบียนนอกประเทศไทย:</B>
        ) : (
          <B>Non-Thai incorporated entities:</B>
        ),
        ordered: true,
        children: [
          {
            text: isTH ? (
              <Text>
                เอกสารของบริษัท (ออกโดยหน่วยงานในประเทศที่จดทะเบียนบริษัท
                ภายในระยะเวลาไม่เกิน 6 เดือน)
              </Text>
            ) : (
              <Text>
                Company Documents (Issued by the country of incorporation and
                dated within the last 6 months):
              </Text>
            ),
            children: isTH
              ? [
                  {
                    text: (
                      <Text>
                        หนังสือรับรองการจดทะเบียนบริษัท หรือ หนังสือบริคณห์สนธิ
                        (Certificate of Company Registration or Company
                        Affidavit){' '}
                      </Text>
                    ),
                  },
                  {
                    text: (
                      <Text>
                        รายการจดทะเบียนบริษัท (Memorandum of Association){' '}
                      </Text>
                    ),
                  },
                  {text: <Text>รายชื่อผู้ถือหุ้น </Text>},
                ]
              : [
                  {text: <Text>Certificate of Company Registration</Text>},
                  {text: <Text>Company Affidavit</Text>},
                  {text: <Text>Memorandum of Association</Text>},
                  {text: <Text>List of Shareholders </Text>},
                ],
          },
          {
            text: isTH ? (
              <Text>เอกสารยืนยันตัวตนของกรรมการผู้มีอำนาจ </Text>
            ) : (
              <Text>
                Identification Document of the Authorized Company Director:
              </Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>
                    สำเนาหนังสือเดินทาง
                    (สำหรับกรรมการที่มีอำนาจลงนามที่ไม่มีสัญชาติไทย)
                    พร้อมลงลายมือชื่อ{' '}
                  </Text>
                ) : (
                  <Text>
                    For a Thai national authorized director, a certified true
                    copy of the national identification card (front side only).
                  </Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>
                    สำเนาบัตรประชาชน
                    (สำหรับกรรมการที่มีอำนาจลงนามที่มีสัญชาติไทย)
                    พร้อมลงลายมือชื่อ
                  </Text>
                ) : (
                  <Text>
                    For a non-Thai national authorized director, a certified
                    true copy of the passport.
                  </Text>
                ),
              },
            ],
          },
          {
            text: isTH ? (
              <Text>ข้อมูลบัญชีธนาคารของบริษัท </Text>
            ) : (
              <Text>Company Bank Account Details:</Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>
                    สำเนาสมุดบัญชีธนาคารไทยของบริษัท
                    (แสดงชื่อบริษัทและเลขที่บัญชี)
                    (กรณีต้องการฝากหรือถอนเงินผ่านธนาคาร)
                  </Text>
                ) : (
                  <Text>
                    Certified true copy of the company’s Thai bank passbook
                    showing the account name and account number (required if the
                    company intends to make deposits or withdrawals via bank
                    transfer)
                  </Text>
                ),
              },
            ],
          },
          {
            text: isTH ? (
              <Text>ข้อมูลทางการเงิน</Text>
            ) : (
              <Text>Financial Documents:</Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>งบการเงินที่ผ่านการตรวจสอบล่าสุด</Text>
                ) : (
                  <Text>Most recent audited financial statements</Text>
                ),
              },
              {
                text: isTH ? (
                  <Text>
                    รายการเดินบัญชีธนาคารของบริษัทย้อนหลัง 6 เดือน
                    หรือเอกสารอื่นที่แสดงแหล่งที่มาของเงินได้หรือเงินทุน
                  </Text>
                ) : (
                  <Text>
                    Company’s bank statements for the past 6 months or other
                    documents showing the source of funds or capital as a
                    substitute.
                  </Text>
                ),
              },
            ],
          },
          {
            text: isTH ? (
              <Text>มติคณะกรรมการบริษัท </Text>
            ) : (
              <Text>Company Board Resolution: </Text>
            ),
            children: [
              {
                text: isTH ? (
                  <Text>
                    รายงานการประชุมที่อนุมัติการเปิดบัญชีกับ KuCoin Thailand
                    ซึ่งดำเนินการโดยบริษัท อีอาร์เอ็กกซ์ จำกัด
                    โดยต้องระบุชื่อผู้ติดต่อที่ได้รับมอบหมาย
                    (ไม่จำเป็นต้องใช้หากบริษัทมีกรรมการผู้มีอำนาจเพียงคนเดียว){' '}
                  </Text>
                ) : (
                  <Text>
                    A copy of the board meeting minutes approving the opening of
                    an account with KuCoin Thailand (operated by ERX Company
                    Limited), clearly stating the name of the designated contact
                    person. This document is not required if the company has
                    only one authorized director.
                  </Text>
                ),
              },
            ],
          },
        ],
      },
      {
        text: isTH ? (
          <>
            <B>*หมายเหตุ: </B>
            <Text>
              เอกสารทั้งหมดจะต้องได้รับการรับรองโดย โนตารีพับลิก (Notary Public)
              ทั้งนี้หากกฎหมายในประเทศของท่านอนุญาตให้ สถาบันการเงิน หรือ
              หน่วยงานที่ได้รับอนุญาต
              สามารถรับรองเอกสารได้โดยเทียบเท่ากับโนตารีพับลิก
              ท่านสามารถใช้การรับรองจากหน่วยงานดังกล่าวแทนได้ หรือ
              รับรองโดยสถานเอกอัครราชทูตหรือสถานกงสุลไทยประจำประเทศที่มีการจัดตั้งบริษัท
            </Text>
          </>
        ) : (
          <>
            <B>*Note: </B>
            <Text>
              All documents must be notarized by a Notary Public. However, if
              the laws of your country permit financial institutions or license
              service providers to certify documents with legal equivalence to
              notarization by a Notary Public, such certification shall be
              deemed acceptable. Alternatively, documents may also be certified
              by the Royal Thai Embassy or Consular in the country where the
              company is incorporated.
            </Text>
          </>
        ),
      },
    ],
    [isTH],
  );

  const onCopy = () => {
    Clipboard.setString(EMAIL);
    showToast(_t('1228835668404000ab32'));
  };

  const renderList = (list, ordered, index = 0) => {
    return (
      <View
        style={{
          paddingLeft: index < 1 ? 0 : 16,
          paddingBottom: index < 1 ? 12 : 0,
        }}>
        {list.map((item, i) => {
          return (
            <View key={`list_${item.key}`}>
              <Text>
                {ordered ? `${i + 1}.` : '•'} {item.text}
              </Text>
              {item.children?.length
                ? renderList(item.children, item.ordered, index + 1)
                : null}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Body>
      <MHeaderMajor leftSlot={<LeftSlot />} />
      <Main>
        <Title>{_t('1cf6fd1fbae84000a269')}</Title>
        <Intro>{_t('70cdc8bacc774000a391')}</Intro>
        <EmailBox>
          <EmailText>{EMAIL}</EmailText>
          <TouchableWithoutFeedback onPress={onCopy}>
            <CopyIcon source={useIconSrc('copy')} autoRotateDisable />
          </TouchableWithoutFeedback>
        </EmailBox>
        {terms.map(term => {
          return (
            <View key={`term_${term.text}`}>
              <ContentTitle>{term.text}</ContentTitle>
              {term.children?.length
                ? renderList(term.children, term.ordered)
                : null}
            </View>
          );
        })}
        <SafeAreaView />
      </Main>
    </Body>
  );
};
