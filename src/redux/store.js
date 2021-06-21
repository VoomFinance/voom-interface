import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import LoadingDucks from './LoadingDucks'
import Web3Ducks from './Web3Ducks'
import ThemeDucks from './ThemeDucks'
import ToastsDucks from './ToastsDucks'

const rootReducer = combineReducers({
    loading: LoadingDucks,
    web3: Web3Ducks,
    theme: ThemeDucks,
    toast: ToastsDucks,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
    const store = createStore( rootReducer, composeEnhancers( applyMiddleware(thunk) ) )
    return store
}