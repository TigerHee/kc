export const UPDATE = 'UPDATE';
export const SET_THEME = 'SET_THEME';
// 定义reducer函数
export const reducer = (state, action) => {
    const { payload } = action;
    switch (action.type) {
        case UPDATE:
            return {
                ...state,
                ...payload,
            };
        default:
            return state;
    }
};
