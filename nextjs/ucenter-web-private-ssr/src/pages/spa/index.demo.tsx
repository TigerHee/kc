import dynamic from 'next/dynamic';
import { initBootConfig } from 'kc-next/boot';

const SpaPage = dynamic(() => import('@/routers/SpaPage'), { ssr: false });
const brandSite = 'DEMO';

export default function Spa() {
  return <SpaPage />;
}

export const getStaticProps = async () => {
  const bootConfig = initBootConfig({
    brandSite,
  });
  return { props: { _BOOT_CONFIG_: bootConfig } };
};
