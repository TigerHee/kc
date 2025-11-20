const addXSite = (baseConfig) => {
    return {
        name: 'addXSite',
        description: '自动添加x-site请求头',
        async onFulfilled(requestConfig) {
            if (baseConfig.xSite) {
                requestConfig.headers.set('X-Site', baseConfig.xSite);
            }
            return requestConfig;
        },
    };
};
export default addXSite;
