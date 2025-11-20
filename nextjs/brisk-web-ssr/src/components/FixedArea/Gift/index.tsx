import { addLangToPath } from '@/tools/i18n';
import { useIsMobile } from '@kux/design';
import { BonusIcon } from '@kux/iconpack';
import FixedItem from '../FixedItem';

const Gift = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <FixedItem
      href={addLangToPath('/land/KuRewards')}
      aria-label="gift"
      target="_blank"
      rel="noopener noreferrer"
    >
      <BonusIcon />
    </FixedItem>
  );
};

export default Gift;
