import dynamic from "next/dynamic";
import { initBootConfig } from "kc-next/boot";

const SpaPage = dynamic(() => import("@/routes/SpaPage"), { ssr: false });
const brandSite = "TR";

export default function Spa() {
  return <SpaPage />;
}

export const getStaticProps = async (context) => {
  const bootConfig = initBootConfig({
    brandSite,
  });
  return { props: { _BOOT_CONFIG_: bootConfig } };
};
