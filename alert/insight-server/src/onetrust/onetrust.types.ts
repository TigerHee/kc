export type CookiesListUsingPost = {
  content: {
    cookieName: string;
    cookieSource: string;
    defaultCategory: string;
    defaultDescription: string;
    defaultThirdPartyDescription: string;
    domainCookieInfo: {
      cookieCategoryID: string;
      cookieId: string;
      description: string;
      displayGroupName: string;
      domainCookieId: string;
      domainName: string;
      thirdParty: boolean;
    }[];
    expiry: string;
    host: string;
    lifespan: string;
    thirdParty: boolean;
  }[];
  numberOfElements: number;
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
};

export type CookieDiffType = {
  added: string[];
  removed: string[];
  changed: {
    item: string;
    from: number;
    to: number;
  }[];
};
