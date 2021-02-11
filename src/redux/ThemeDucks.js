const dataState = {
    theme: null,
    innerWidth: null
}

const CHANGE_THEME = 'CHANGE_THEME'
const CHANGE_INNER_WIDTH = 'CHANGE_INNER_WIDTH'

export default function reducer(state = dataState, action) {
    switch (action.type) {
        case CHANGE_THEME:
            return { ...state, theme: action.payload }
        case CHANGE_INNER_WIDTH:
            return { ...state, innerWidth: action.payload }
        default:
            return state
    }
}