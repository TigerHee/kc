/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICDeleteOutlined } from '@kux/icons';

export const Wrapper = styled.div`
  .KuxUpload-root {
    margin-bottom: 0;
  }
  .KuxUpload-wrapper {
    width: 100%;
    height: fit-content;
  }
`;
export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-size: 18px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 6px;
  color: var(--color-text);
  &.isSmStyle {
    font-size: 14px;
  }
`;
export const ExpandWrapper = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  .fileLength {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-top: 12px;
    color: var(--color-text40);
  }
  .singleFileName {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-top: 16px;
    text-align: center;
    color: var(--color-text40);
  }
`;
export const DescBox = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: var(--color-text60);
  margin-bottom: ${({ ignoreBoxMb }) => (ignoreBoxMb ? '0' : '16px')};
  &.isSmStyle {
    margin-bottom: ${({ ignoreBoxMb }) => (ignoreBoxMb ? '0' : '16px')};
  }
  .subTitleContent {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 12px;
    color: var(--color-text);
  }
  .subTitleContentList {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin-bottom: 12px;
    padding-left: 12px;
    color: var(--color-text);
  }
  .descContent {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    color: var(--color-text40);
    div {
      display: flex;
      &::before {
        content: '';
        display: flex;
        flex-shrink: 0;
        margin-top: 8px;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        margin-right: 8px;
        margin-left: 8px;
        background-color: var(--color-icon60);
      }
    }
  }
  b {
    font-weight: 500;
    color: var(--color-text);
  }
  a {
    text-decoration: underline;
    color: var(--color-text);
  }
  p {
    margin-top: 6px;
  }
`;
export const DescItem = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  display: flex;
  color: var(--color-text40);
  .point {
    flex-shrink: 0;
    margin-top: 6px;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    margin-right: 8px;
    background-color: var(--color-icon60);
  }
`;
export const UploadTriggerContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 24px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px dashed var(--color-text20);
  background-color: var(--color-cover2);
  &.noColPanding {
    padding: 0 24px;
  }
  .triggerIcon {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
  }
  .triggerTitle {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    margin-bottom: 4px;
    color: var(--color-text);
    b {
      font-weight: 700;
      text-decoration: underline;
    }
  }
  .triggerDesc {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text60);
  }
  .singlePreviewImg {
    height: 143px;
  }
`;
export const FileViewList = styled.div``;
export const FileViewItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-divider8);
  }
  .fileData {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .imgBox {
    width: 48px;
    height: 37px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
    border: 1px solid var(--color-divider8);
  }
  .imgBoxNoBorder {
    border: 0;
  }
  .fileIcon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }
  .fileName {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 140%;
    white-space: normal;
    word-break: break-all;
    color: var(--color-text);
  }
  .fileNameErr {
    color: var(--color-secondary);
  }
  .cursorPointer {
    cursor: pointer;
    &:hover {
      color: var(--color-primary);
    }
  }
  .fileSize {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text40);
  }
  .actionBox {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 24px;
  }
  .fileRetry {
    flex-shrink: 0;
    cursor: pointer;
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    line-height: 18.2px;
    color: var(--color-primary);
  }
`;
export const DelIcon = styled(ICDeleteOutlined)`
  margin-left: 16px;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 16px;
  color: var(--color-icon);
  &:hover {
    color: var(--color-primary);
  }
`;
