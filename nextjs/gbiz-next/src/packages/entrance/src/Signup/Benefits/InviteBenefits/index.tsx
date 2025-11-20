/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import { Earn } from './components/Earn';
import { Level } from './components/Level';
import { NewcomerBonus } from './components/NewcomerBonus';
import { useInviteBenefits } from './store';

export function InviteBenefits({ inviterInfo }: { inviterInfo?: any }) {
  const loadAll = useInviteBenefits().loadAll;

  useEffect(() => {
    loadAll();
  }, []);

  if (!inviterInfo) return null;
  return (
    <div>
      <NewcomerBonus />
      <Level />
      <Earn />
    </div>
  );
}
