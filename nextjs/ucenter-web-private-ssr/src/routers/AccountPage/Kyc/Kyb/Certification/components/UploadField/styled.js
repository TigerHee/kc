/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICWarningOutlined } from '@kux/icons';
import { styled } from '@kux/mui';

export const InnerWrapper = styled.div`
  flex: 1;
  .KuxForm-itemHelp {
    min-height: 0;
    max-height: 0;
    > .KuxForm-itemError {
      opacity: 0 !important;
    }
  }
`;
export const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
`;
export const Description = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  margin-top: 6px;
  .bold {
    color: ${({ theme }) => theme.colors.text};
    font-weight: bold;
  }
`;
export const List = styled.div``;
export const FileNum = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  margin-top: 16px;
`;
export const Item = styled.div`
  padding: 16px 12px 16px 0;
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
  &:not(:first-child) {
    border-top: 1px solid ${({ theme }) => theme.colors.divider8};
  }
`;
export const DeleteButton = styled.div`
  cursor: pointer;
  height: 20px;
  color: ${({ theme }) => theme.colors.icon};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ErrorMsg = styled.div`
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  height: 24px;
`;
export const Tips = styled.div`
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
  }
`;

export const UploadInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 20px;
  ${({ theme, fail }) => {
    return fail
      ? `
      background: rgba(246, 84, 84, 0.04);
      color: ${theme.colors.secondary};  
    `
      : `
      background: ${theme.colors.cover4};
      color: ${theme.colors.text60};
    `;
  }};
`;
export const UploadInfo = ({ children, ...props }) => {
  return (
    <UploadInfoWrapper {...props}>
      <ICWarningOutlined size={16} />
      {children}
    </UploadInfoWrapper>
  );
};
export const UploadArea = styled.div`
  display: flex;
  padding: 20px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 8px;
  border: 0.595px dashed ${({ theme }) => theme.colors.text20};
  background: ${({ theme }) => theme.colors.cover2};
  cursor: pointer;
  margin-top: 20px;
  img {
    margin-bottom: 12px;
  }
  input {
    display: none;
  }
`;
export const UploadAreaTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 140%; /* 19.6px */
  margin-bottom: 4px;
`;
export const UploadAreaDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
`;
export const FileLoad = styled.div`
  display: flex;
  width: 48px;
  height: 37px;
  justify-content: center;
  align-items: center;

  @keyframes rotate360 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  img {
    transform-origin: center center;
    animation: rotate360 2s linear infinite;
  }
`;
export const ItemPrefix = styled.div`
  display: flex;
  width: 48px;
  height: 37px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  img.fill {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
export const ItemLabel = styled.div`
  color: ${({ theme, fail }) => (fail ? theme.colors.secondary : theme.colors.text)};
  font-size: 14px;
  font-weight: 500;
  line-height: 140%; /* 19.6px */
  flex: 1;
`;

export const ItemFailInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 400;
  line-height: 140%; /* 16.8px */
  display: flex;
  gap: 8px;
`;
