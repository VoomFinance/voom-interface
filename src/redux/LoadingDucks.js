const dataState = {
    isLoading: false
}

const SHOW_LOADING = 'SHOW_LOADING'
const HIDE_LOADING = 'HIDE_LOADING'

export default function reducer(state = dataState, action) {
    switch (action.type) {
        case HIDE_LOADING:
            return { ...state, isLoading: false }
        case SHOW_LOADING:
            return { ...state, isLoading: true }
        default:
            return state
    }
}

export const showLoading = (error) => (dispatch, getState) => {
    dispatch({
        type: SHOW_LOADING
    })
}

export const hideLoading = (error) => (dispatch, getState) => {
    dispatch({
        type: HIDE_LOADING
    })
}