import { _DEV_ } from "@/config/env";
import prod from "./prod";
import dev from "./dev";

type ApiHostsConfig = {
  v2ApiHosts: {
    CMS: string;
    WEB: string;
    POOLX: string;
    ROBOT: string;
  };
};

const config: ApiHostsConfig = _DEV_ ? dev : prod;

export default config;
