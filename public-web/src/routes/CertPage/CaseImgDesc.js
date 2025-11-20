/**
 * Owner: faye@kupotech.com
 */
import styled from '@emotion/styled';
import { ICCloseFilled, ICSuccessFilled } from '@kux/icons';
import case1Img from 'static/cert/case1.png';
import case2Img from 'static/cert/case2.png';
import case3Img from 'static/cert/case3.png';
import case4Img from 'static/cert/case4.png';
import { _t } from 'tools/i18n';

const CaseContent = styled.div`
  width: 100%;
  .case-title {
    margin-top: 24px;
    color: #01bc8d;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
  }
  .case-item {
    margin: 12px 0;
    color: rgba(29, 29, 29, 0.6);
    font-weight: 400;
    font-size: 13px;
    font-family: Roboto;
    line-height: 16.9px;
  }
`;
const FLEX = styled.div`
  display: flex;
  justify: space-between;
  gap: 12px;
  width: 100%;
  color: rgba(0, 0, 0, 1);
  font-weight: 600;
  .case-item-img {
    flex: 1;
    text-align: center;
  }
  .iconBtn {
    display: inline-block;
  }
  .errorBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px auto 0 auto;
    padding: 5px 12px 5px 8px;
    font-size: 14px;
    border: 1px solid rgba(246, 84, 84, 0.2);
    border-radius: 22px;
    .errorIcon {
      margin-right: 1px;
      color: rgba(246, 84, 84, 1);
    }
  }
  .rightBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px auto 0 auto;
    padding: 5px 12px 5px 8px;
    font-size: 14px;
    border: 1px solid rgba(24, 202, 81, 0.2);
    border-radius: 22px;
    .rightIcon {
      margin-right: 1px;
      color: rgba(24, 202, 81, 1);
    }
  }
  img {
    width: 100%;
  }
`;

export default () => {
  return (
    <CaseContent>
      <div className="case-title">{_t('7825252898794000adea')}</div>
      <div className="case-item">{_t('a7f98790e7654000a247')}</div>
      <FLEX>
        <div className="case-item-img">
          <img src={case1Img} alt="caseimg" />
          <div className="iconBtn">
            <div className="errorBtn">
              <ICCloseFilled className="errorIcon" /> <span>{_t('bdf0e0c1b7ea4000a52d')}</span>
            </div>
          </div>
        </div>
        <div className="case-item-img">
          <img src={case2Img} alt="caseimg" />
          <div className="iconBtn">
            <div className="rightBtn">
              <ICSuccessFilled className="rightIcon" /> <span>{_t('bb5ebb09485c4000adf0')}</span>
            </div>
          </div>
        </div>
      </FLEX>

      <div className="case-item">{_t('4cf8db8413c04000a5f7')}</div>
      <FLEX>
        <div className="case-item-img">
          <img src={case3Img} alt="caseimg" />
          <div className="iconBtn">
            <div className="errorBtn">
              <ICCloseFilled className="errorIcon" /> <span>{_t('bdf0e0c1b7ea4000a52d')}</span>
            </div>
          </div>
        </div>
        <div className="case-item-img">
          <img src={case4Img} alt="caseimg" />
          <div className="iconBtn">
            <div className="rightBtn">
              <ICSuccessFilled className="rightIcon" /> <span>{_t('bb5ebb09485c4000adf0')}</span>
            </div>
          </div>
        </div>
      </FLEX>
    </CaseContent>
  );
};
