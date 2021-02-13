const dataState = {
  web3: false,
  address: null,
  metamask: false,
  block: null,
  network: null,
  isConnected: null,
  sponsor: null,
  reload: null,
  timestamp: 0,
  token: null,
  voom: null,
  reinvest: null,
  walletconnect: null,
}

const CHANGE_WEB3 = "CHANGE_WEB3"
const CHANGE_ADDRESS = "CHANGE_ADDRESS"
const CHANGE_METAMASK = "CHANGE_METAMASK"
const NEW_BLOCK = "NEW_BLOCK"
const CHANGE_NETWORK = "CHANGE_NETWORK"
const CHANGE_CONNECTED = "CHANGE_CONNECTED"
const CHANGE_SPONSOR = "CHANGE_SPONSOR"
const CHANGE_RELOAD = "CHANGE_RELOAD"
const NEW_BLOCK_TIME = 'NEW_BLOCK_TIME'
const INTERFACE_TOKEN = "INTERFACE_TOKEN"
const INTERFACE_VOOM = "INTERFACE_VOOM"
const CHANGE_REINVEST = "CHANGE_REINVEST"
const CHANGE_WALLECTCONNECT = "CHANGE_WALLECTCONNECT"

export default function reducer(state = dataState, action) {
  switch (action.type) {
    case CHANGE_WEB3:
      return { ...state, web3: action.payload }
    case CHANGE_ADDRESS:
      return { ...state, address: action.payload }
    case CHANGE_METAMASK:
      return { ...state, metamask: action.payload }
    case INTERFACE_TOKEN:
      return { ...state, token: action.payload }
    case INTERFACE_VOOM:
      return { ...state, voom: action.payload }
    case NEW_BLOCK:
      return { ...state, block: action.payload }
    case CHANGE_NETWORK:
      return { ...state, network: action.payload }
    case CHANGE_CONNECTED:
      return { ...state, isConnected: action.payload }
    case CHANGE_SPONSOR:
      return { ...state, sponsor: action.payload }
    case CHANGE_RELOAD:
      return { ...state, reload: action.payload }
    case NEW_BLOCK_TIME:
      return { ...state, timestamp: action.payload }
    case CHANGE_REINVEST:
      return { ...state, reinvest: action.payload }
    case CHANGE_WALLECTCONNECT:
      return { ...state, walletconnect: action.payload }
    default:
      return state
  }
}