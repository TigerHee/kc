import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import WordTypeComp from '@/components/SecurityPage/WordType/index';

const WordType = () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.accountSecurity.wordType.index}>
      <WordTypeComp />
    </ErrorBoundary>
  );
};


export default function WordTypePage() {

  return <AccountLayout><WordType /></AccountLayout>;
};
