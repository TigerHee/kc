export interface AppContext {
  pageProps: any;
}

export interface IAppModule {
  name: string;
  init: (context?: AppContext) => void;
  destroy?: () => void;
}
