// 打包 systemjs给非ssr工程不能直接用，占位和打npm包保持一致，关于路由还是和之前g-biz一样
export const useRouter = () => {
  return {
    push() {},
    replace() {},
  };
};
