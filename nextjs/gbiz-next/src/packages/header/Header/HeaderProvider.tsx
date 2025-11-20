import { CommonServiceProvider } from 'packages/header/hookTool/useCommonService';

export default function HeaderProvider({ children }) {
  return <CommonServiceProvider>{children}</CommonServiceProvider>;
}
