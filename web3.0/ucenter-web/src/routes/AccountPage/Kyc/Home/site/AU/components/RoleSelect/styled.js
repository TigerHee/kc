import { styled } from '@kux/mui';

export const RoleSvg = ({ size, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 21 21"
    fill={color}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3281 3.76725C8.74057 3.76725 7.42562 5.09358 7.42562 6.69809C7.42562 8.29439 8.73241 9.60059 10.3281 9.60059C11.9157 9.60059 13.2306 8.27426 13.2306 6.66975C13.2306 5.07344 11.9238 3.76725 10.3281 3.76725ZM5.75896 6.69809C5.75896 4.18926 7.80402 2.10059 10.3281 2.10059C12.8441 2.10059 14.8973 4.15273 14.8973 6.66975C14.8973 9.17858 12.8522 11.2673 10.3281 11.2673C7.81218 11.2673 5.75896 9.21511 5.75896 6.69809ZM6.99479 13.7673C5.6217 13.7673 4.49479 14.8942 4.49479 16.2673V17.1006H16.1615V16.2673C16.1615 14.8942 15.0346 13.7673 13.6615 13.7673H6.99479ZM2.82812 16.2673C2.82812 13.9737 4.70122 12.1006 6.99479 12.1006H13.6615C15.955 12.1006 17.8281 13.9737 17.8281 16.2673V17.1006C17.8281 18.0192 17.08 18.7673 16.1615 18.7673H4.49479C3.57622 18.7673 2.82812 18.0192 2.82812 17.1006V16.2673Z"
    />
  </svg>
);

export const RoleOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0 12px;
`;
export const RoleOptionTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 700;
  line-height: 140%;
`;
export const RoleOptionBenefits = styled.div`
  display: flex;
  padding: 6px 12px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
  background: ${({ theme }) => theme.colors.cover4};
`;
export const RoleOptionBenefitItem = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 500;
  line-height: 140%;
  display: flex;
  gap: 6px;
`;
export const RoleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  font-weight: 400;
  line-height: 140%;
  b {
    font-weight: 700;
  }
  ul,
  ol {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 1.5em;
  }
  ul > li {
    list-style-type: initial;
  }
  ol > li {
    list-style-type: decimal;
  }
`;
