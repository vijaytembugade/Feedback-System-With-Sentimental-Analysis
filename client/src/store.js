import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools as devCompose } from 'redux-devtools-extension';
import { composeWithDevTools as prodCompose } from 'redux-devtools-extension/logOnlyInProduction';

const intialState = {};
const store = createStore(
	rootReducer,
	intialState,
	process.env.NODE_ENV === 'production'
		? prodCompose(applyMiddleware(thunk))
		: devCompose(applyMiddleware(thunk))
);

export default store;
