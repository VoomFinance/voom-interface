const dataState = {
    theme: null,
}

const CHANGE_THEME = 'CHANGE_THEME'

export default function reducer(state = dataState, action) {
    switch (action.type) {
        case CHANGE_THEME:
            return { ...state, theme: action.payload }
        default:
            return state
    }
}