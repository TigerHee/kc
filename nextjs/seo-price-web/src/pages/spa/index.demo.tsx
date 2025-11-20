import dynamic from "next/dynamic";
const SpaPage = dynamic(() => import("@/routes/SpaPage"), { ssr: false });
import { initBootConfig } from "kc-next/boot";

const brandSite = "DEMO";

export default function Spa() {
  return <SpaPage />;
}

export const getStaticProps = async (context) => {
  const bootConfig = initBootConfig({
    brandSite,
  });
  return { props: { _BOOT_CONFIG_: bootConfig } };
};
