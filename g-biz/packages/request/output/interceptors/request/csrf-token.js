const addCsrfToken = (baseConfig) => {
    return {
        name: 'addCsrfToken',
        description: '自动添加csrfToken',
        async onFulfilled(requestConfig) {
            if (requestConfig.disableCsrfToken || !baseConfig.csrfToken) {
                return requestConfig;
            }
            requestConfig.params = requestConfig.params || {};
            requestConfig.params.c = baseConfig.csrfToken;
            return requestConfig;
        },
    };
};
export default addCsrfToken;
