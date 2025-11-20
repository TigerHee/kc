/**
 * Owner: tiger@kupotech.com
 * 协议
 */
import styled from '@emotion/styled';
import React from 'react';
import siteConfig from 'utils/siteConfig';

const Link = styled.a`
  display: flex;
  margin-bottom: 6px;
  white-space: normal;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.primary60};
  text-decoration: underline;
  &::before {
    position: relative;
    top: 6px;
    display: inline-flex;
    flex-shrink: 0;
    width: 4px;
    height: 4px;
    margin-right: 6px;
    background-color: ${({ theme }) => theme.colors.primary60};
    border-radius: 50%;
    content: '';
  }
`;

const zh_hosted = (url) => [
  '在用戶點擊同意本協議之前，請用戶務必審慎閱讀、充分理解各條款內容，特別是免除或者限制責任的條款。除非用戶接受本協定的全部條款，否則用戶將無權使用平臺此服務。如用戶不同意本協議內容或拒絕承認平臺有權隨時單方面修改本協議，應立即停止使用和瀏覽平臺，點擊同意本協議，即視為用戶充分理解並完全接受本協議的所有條款，包括平臺隨時對本協議做出的任何修改。如用戶對協議有任何疑問，可向平臺客服諮詢。',
  '1、本產品是爲用戶提供託管子賬戶仲介服務，在本協議中，除非本協議的任何條款或條件另有規定，否則下列術語和表述應具有以下含義：',
  '（1）託管子賬戶：一種特殊的子帳戶類型，用戶將其子帳戶委託給交易團隊進行管理；',
  '（2）交易團隊：尋求為用戶管理資產的交易團隊或機構',
  `2、此協定作為平臺用戶使用條款的補充協定，未規定事宜以平臺用戶使用條款為准，請參閲${url}。請用戶使用本產品前仔細閱讀平臺用戶使用條款，使用過程中嚴格遵守，保證並承諾其透過本產品進行交易所使用的資金來源合法，並非來源於任何非法活動或手段。平臺單方獨立判斷認為可能發生危害交易安全的事件時，平臺有權暫停、中斷或終止全部或部分根據本協議向用戶提供的服務（包括收費服務），刪除或刪除該用戶的註冊資訊，沒收該用戶可能獲得的不正當利益，不通知該用戶，也不對該用戶或任何協力廠商承擔任何責任，用戶同意承擔由此產生的任何及所有直接或間接費用或損失。`,
  '3、使用本產品，平臺僅為用戶提供託管子帳戶撮合服務，平臺僅對交易團隊提供的資訊文本進行形式審核，對其資訊的準確性、完整性和合法性不作任何保證或承擔任何責任。用戶應根據自己的獨立判斷做出決定，並應聘請自己的顧問或自己對交易團隊進行調查及研究，交易團隊的交易策略、交易行為等均為交易團隊的操作，與平臺無關。平臺不就任何交易向用戶提供任何投資、法律、稅務或其他專業意見。',
  '4、請用戶在同意綁定交易團隊之前仔細確認已與交易團隊簽署書面委託協定，明確約定了用戶與交易團隊之間的權利義務，平臺無權干涉用戶與交易團隊的委託內容，用戶與交易團隊之間因託管服務產生或與之相關的任何糾紛，由糾紛雙方自行解決，平臺不承擔任何交易風險和法律責任。',
  '5、用戶因交易團隊託管過程中的交易行為產生的任何風險及損失由用戶自行承擔，用戶無權據此向平臺提出任何索賠。',
  '本協定自用戶選擇同意時生效，本協議的最終解釋權歸本平臺所有。',
];

const en_hosted = (url) => [
  "The Platform hereby reminds the Users to carefully read and fully understand the terms and conditions of this Agreement before clicking to agree to it, especially those terms and conditions of this Agreement that exclude or limit the liability of the Platform and exclude or restrict the rights and interests of the Users. Unless a User accepts all the terms and conditions of this Agreement, the User shall not be entitled to use the services provided by the Platform. If the User does not agree to the content of this Agreement or refuses to recognize the right of the Platform to make unilateral amendments to this Agreement at any time, the User shall promptly stop using and cease to access the Platform. By registering as a User of the Platform or using the services offered, a User is deemed to fully understand and fully accept all the terms and conditions of this Agreement, including any amendments that this Company may make to this Agreement at any time. If the User have any questions about the Agreement, please contact the Platform's customer service.",
  '1.	This Product provides matching services for Managed Trading Sub-Accounts. In this Agreement, the following terms and expressions shall have the meanings ascribed to them below, unless any term or condition herein requires otherwise',
  '(1) Managed Trading Sub Account: A special sub-account type where Users entrust their sub accounts to Trading Teams;',
  '(2) Trading Teams: teams or institutions seeking to provide asset management services to their users.',
  `2.	This Agreement is supplementary to the Terms of Use of the Platform, any matters not stipulated herein are subject to the Terms of Use. Please refer to ${url}. Please read the Terms of Use carefully before using the product and strictly observe them during use. The User must guarantee and undertake that the funds the User uses in trading through the Platform are from legal sources and has not been derived from any illegal activities or means; Where the Platform deems on its unilateral and independent judgement that any event that undermines the security of trading may arise, the Platform shall have the right to suspend, interrupt or terminate all or part of the User services (including fee-based services) provided to a User under this Agreement, remove or delete registration information of such a User, seize illicit profits that the User may gain, without notifying such User and without assuming any responsibility to such User or any third party. The User agrees to bear any and all direct or indirect expenses or losses arising therefrom.`,
  '3.	Using this Product, the Platform only provides matching services for Managed Trading Sub-Accounts. The Platform is only responsible for reviewing the text of information released by the Trading Teams, and does not guarantee or assume any responsibility for the accuracy, completeness or legality of such information. The Users shall make decisions based on their independent judgment and shall engage their own advisors and/or conduct their own research on Trading Teams. The trading strategies and trading behaviour of the Trading Teams are the actions of the Trading Team and are not related to the platform. The Platform cannot provide any investment, legal, taxation or other professional opinions to the Users in connection with any of digital asset transactions.',
  '4.	Please make sure that you have signed a written engagement agreement with the Trading Team before agreeing to be bound to the Trading Team, which clearly sets out the rights and obligations between you and the Trading Team. The Platform does not have any right to interfere with the content entrusted to it by the User and the Trading Team. Any dispute between a User and the Trading Teams arising from or related to Managed Trading Sub-Accounts services shall be settled by and between the parties to the dispute themselves, and the Platform shall not bear any transaction risk or legal liability whatsoever.',
  '5.	Any risks and losses arising from the trading activities of the Trading Teams are the sole responsibility of the User and the User has no right to make any claims against the Platform in this regard.',
  'This Agreement shall take effect after the User has clicked the agree button and proceeded to the next step. The ultimate power to interpret this Agreement shall be vested in this Platform.',
];

export const HOSTED_AGREEMENT = { zh: zh_hosted, en: en_hosted };

export const MARGIN_AGREEMENT = [
  'Margin Trading Agreement',
  'The margin trading mentioned in this Agreement refers to the transaction that you participate in, by borrowing a certain amount of digital tokens from KuCoin (hereinafter referred to as “us” or “our” or “we”) through pledging digital tokens, and carrying out going long (buying)/going short (selling) operations, to leverage large capital with smaller one and earn more income. The Agreement is intended to serve as a formal agreement between our two parties on margin trading services, and clarify the rights and obligations of both parties in the process of margin trading services.',
  'I. When you click the "Read and Agree" button on the page of our "Margin Trading Agreement" (hereinafter referred to as "the Agreement"), it indicates that you have fully accepted all the terms of the Agreement.',
  'II. We cannot guarantee the legality of a particular digital token, that is, we cannot accurately determine whether it is legitimate to hold or trade such digital tokens. Margin trading may face the risk of regulatory policies within a certain jurisdiction. Thus before any of your transactions, you shall make a prudent judgment on the premise of understanding the regulatory policies of the territory, in which the transactions take place. You shall bear your own responsibility and fully understand the laws and regulations applicable to the disposal, supervision and taxation concerning digital tokens and their over-the-counter transactions.',
  'III. Due to the high risk of this trading method, margin trading is suitable only for professional investment institutions or those with rich investment experience, or the people who fully understand all the risks related to margin trading, and can withstand partial or all losses of the funds in their accounts due to investment missteps. Your margin trading on our platform is entirely a voluntary transaction behavior conducted by you based on your own economic situation and after understanding the risks involved, and has nothing to do with us or any third party.',
  'IV. When conducting margin trading on our platform, you may obtain higher investment returns, but you may also encounter greater investment risk. In order to give you an insight into the risks involved, in accordance with relevant laws, administrative regulations and national policies, the risk disclosure statement is hereby provided for you to read carefully. The risks existed in your margin trading on our platform include but not limited to:',
  '(1) The risk of digital token asset ("digital asset") itself: The digital asset market is a brand new field and yet unrecognized, and may not grow. At present, digital assets are mainly used by speculators in large quantities, and less used in the retail and commercial markets. As a result, the prices of digital assets are prone to volatility and, in turn, adversely affect the investment in digital assets. The digital asset market does not have a price limiting mechanism as the stock market does, and it is open for transaction 24 hours a day. Due to the fact that there’s relatively less deals in the market, the prices of digital assets are prone to sharp fluctuations as the result of the manipulation of key traders (namely, the bankers) and the influence of government policies across the globe. It is possible that the price of a digital asset may increase several times a day, or fall by half in one day. Therefore, the economic losses caused to you due to the trading characteristics of the digital assets shall be born entirely by you.',
  '(2) Policy risk: Due to the formulation or amendment of the laws, regulations and regulatory documents of various countries, the transactions between funds may be suspended or prohibited at any time. The economic losses incurred due to the suspension or prohibition of the transaction of digital tokens as the result of such formulation or amendment shall be borne entirely by you.',
  '(3) Internet and technology risks: We cannot guarantee that all the information, programs, texts, among others contained in our platform are completely safe and free from the interference or damage of any malicious programs such as viruses and Trojans. Therefore, your behavior like logging in and using any of our services, or downloading and using any of the downloaded programs, information, data, etc., is up to your own decision and at your own risk, any and all losses thus incurred shall be fully borne by you. There are also risks associated with the use of Internet-based trading systems, including but not limited to the failure of software, hardware or Internet connection. Since we cannot control the reliability and availability of the Internet, we will not be liable for any distortion, delay or connection failure.',
  '(4) Force majeure risks: We will not be liable for any failure or delay in our service as well as any loss thus incurred due to any actions of any third party beyond our control, or any force majeure, including but not limited to: information network equipment maintenance, information network connection failure, computer or communication or other trading system failure, power failure, hacking, extreme weather, accident, strike, labor dispute, revolt, uprising, riot, lack of productivity or production means, fire, flood, storm, explosion, war, the reasons of a bank or any other partner, the collapse of the digital token market, government actions, judicial or administrative order.',
  '(5) Market information risk. We do not guarantee the correctness and applicability of the market analysis, market evaluation, etc. As for the information or advice that you have received or will receive from the introducer or any other organization or its employee, we cannot control, or support, or guarantee the accuracy or completeness of the content related to the transaction. All risks arising therefrom shall be borne by you, and we will not bear any responsibility.',
  '(6) Risks of being seized and frozen. When the competent authority presents corresponding investigation documents and asks us to cooperate in investigating your account on our platform, or take measures to seize, freeze or transfer your account, we will, as per the requirements of the competent authority, provide the corresponding data of your account, or carry out corresponding operations. We will not be liable for any privacy disclosure or inoperability of your account or any loss thus incurred.',
  '(7) Market risk. The amount of investment return is closely related to the market, such as economic situation and the changes in international economic conditions. These risks exist in the investment and financing, and almost all investment assets will be affected by the market. Any and all economic losses caused by such market risks shall be borne by you, and we will assume no responsibility for that.',
  '(8) Risks of risk control operations taken by us. By introducing margin, spot trading can increase your revenue if the market moves in the same direction as your judgment; but if the market moves in a direction opposite to your judgment, the loss will also be amplified. In the event of any risk exposure in a margin trading account, we are entitled to implement risk control operations such as reducing the position, closing the position, or automatic repayment. You shall fully understand the high risk of margin trading and bear all economic losses arising from such leveraged trading, and we will assume no responsibility for that.',
  '(9) Other risks: The losses caused by your failure to remember your account name or password, improper operation, or bad investment decision, etc.; the losses caused by online entrustment, or malicious operations by another person; the losses caused by entrusting another person to conduct, on your behalf, margin trading on our platform; the losses caused by any accident or any other reason instead of us; other risks listed in the Terms of Use and other agreements. All the above mentioned losses will be borne by you.',
  '(10) When participating in our margin trading, you shall control the risks, evaluate the value and the risks of digital token investment, and bear the economic risk of losing all the money you have invested in it; you shall get involved in such transactions based on your economic conditions and risk tolerance, and be fully aware of the risks existed in digital token investment. When you invest in the margin trading of digital tokens, you have both the possibility of reaping profits and the risk of suffering losses.',
  'The risk disclosure statement in the Agreement is unable to reveal all risks existed in the margin trading of digital tokens. Please be sure to have a clear understanding that as the market is risky, investment decisions must be made prudently.',
  'V. As for the risk of closing positions caused by various factors such as server gateway throttling and unstable website access, we will assume no legal responsibility.',
  'VI. When your debt ratio is greater than or equal to Debt Ratio for Margin Call, the trading system will liquidate your account to close your positions in accordance with our real-time order price, so as to return the loan. If the price fluctuates drastically and the trading system is unable to close your positions, resulting in a loss on the platform, we are entitled to recover the loss from you.',
  'VII. The maximum loan amount currently supported by us is determined based on the number of leverage: For the leverage 3X, the corresponding maximum loan amount is 2 times; for the leverage 5X, the corresponding maximum loan amount is 4 times.',
  'VIII. We will start to calculate the interest the moment you get a loan from the platform. The accrued interest will be calculated on an hourly basis, and the time less than one hour will be counted as an hour. The accrued interest is calculated by the amount of the loan multiplied by the hourly interest rate and will be settled in a lump sum when you repay the loan.',
  'IX. In order to ensure fund security, when you have an unrepaid loan, your maximum withdrawal amount in your margin account (equivalent BTC) on our platform = (initial debt ratio * account balance – debt) / initial debt ratio * 60%.',
  'X. Each time you apply for a loan and then return the loan, it will be treated as a deal, and you will be charged for the interest.',
  'XI. The contents not agreed in the Agreement shall be executed with reference to the User Agreement or similar agreement in the trading system.',
  'XII. Others: Please read the Agreement carefully before applying the margin trading services provided by us. Once the relevant operations are carried out, you are deemed to have read and agreed to the terms of the Agreement. We reserve the right to modify the contents of the Agreement without any further notice, and we have the final right to interpret the contents of the Agreement.',
];

const urls = [
  `${siteConfig?.KUCOIN_HOST}/announcement/en-futures-terms-of-use`,
  `${siteConfig?.KUCOIN_HOST}/legal/en-terms-of-use`,
  `${siteConfig?.KUCOIN_HOST}/announcement/en-futures-privacy-policy`,
  `${siteConfig?.KUCOIN_HOST}/announcement/en-futures-risk-disclosure-statement`,
];

export const FUTURE_AGREEMENT = (
  <React.Fragment>
    <div>
      Please read and fully understand the following terms. Clicking “Sign Up” or access or use the
      services directly means you agree and accept the terms of KuCoin Futures.
    </div>
    {urls.map((i) => (
      <Link href={i} target="_blank" rel="nofollow noreferrer" key={i}>
        {i}
      </Link>
    ))}
  </React.Fragment>
);
