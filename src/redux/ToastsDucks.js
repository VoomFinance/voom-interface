const dataState = {
    show: false,
    type: "success",
    data: {
        title: "",
        value: "",
        hash: ""
    },
    time: 15000
}

const SHOW_TOAST = 'SHOW_TOAST'
const TYPE_TOAST = 'TYPE_TOAST'
const TIME_TOAST = 'TIME_TOAST'
const DATA_TOAST = 'DATA_TOAST'

export default function reducer(state = dataState, action) {
    switch (action.type) {
        case SHOW_TOAST:
            return { ...state, show: action.payload }
        case TYPE_TOAST:
            return { ...state, type: action.payload }
        case DATA_TOAST:
            return { ...state, data: action.payload }
        case TIME_TOAST:
            return { ...state, time: action.payload }
        default:
            return state
    }
}