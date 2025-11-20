import { AuthRoleEnum } from './constants/user.constant';

export type RequestWithUser = Request & {
  user: RequestUserInfo;
  cookie: any;
  cookies: any;
};

export type RequestUserInfo = {
  id: string;
  role: AuthRoleEnum;
  name: string;
  email?: string;
  type: 'apikeys' | 'azure';
  // meta: {
  //   aud: '4928ab6d-3a34-444f-aec5-1264fe239317',
  //   iss: 'https://sts.windows.net/7c3550b8-c3ce-4b66-943d-04fb264b5a5b/',
  //   iat: 1732091591,
  //   nbf: 1732091591,
  //   exp: 1732095830,
  //   acr: '1',
  //   aio: 'AVQAq/8YAAAAjQzTWMezDmClIArbGZTe4K3+fASPbeoMY5CpSUlOGHxDwXuqEHYNJVVxgQlr46rm73G50qrtNkVjOEvihwHm8Wn3aOfNOquhIQCZ4HxkF2E=',
  //   amr: [ 'pwd', 'mfa' ],
  //   appid: '4928ab6d-3a34-444f-aec5-1264fe239317',
  //   appidacr: '1',
  //   given_name: 'lucas.zhou',
  //   ipaddr: '203.116.182.178',
  //   name: 'lucas.zhou',
  //   oid: 'f86531b6-43cd-4c54-9062-94b798fd3f7b',
  //   onprem_sid: 'S-1-5-21-1450776069-3158420450-2094912981-5270',
  //   rh: '1.AVYAuFA1fM7DZkuUPQT7JktaW22rKEk0Ok9ErsUSZP4jkxefADtWAA.',
  //   scp: 'User.Read',
  //   sub: 'FXirk8V-MZgCwW4ttI6kShrKmwpIH_R1mY91Qh-q_hE',
  //   tid: '7c3550b8-c3ce-4b66-943d-04fb264b5a5b',
  //   unique_name: 'lucas.zhou@qakupotech.com',
  //   upn: 'lucas.zhou@qakupotech.com',
  //   uti: 'xUdIj3PCkkitXkzxm4QTAA',
  //   ver: '1.0'
  // }
  // meta: {
  //   aud: string,
  //   iss: string,
  //   iat: number,
  //   nbf: number,
  //   exp: number,
  //   acr: string,
  //   aio: string,
  //   amr: string[],
  //   appid: string,
  //   appidacr: string,
  //   given_name: string,
  //   ipaddr: string,
  //   name: string,
  //   oid: string,
  //   onprem_sid: string,
  //   rh: string,
  //   scp: string,
  //   sub: string,
  //   tid: string,
  //   unique_name: string,
  //   upn: string,
  //   uti: string,
  //   ver: string,
  // },
};
