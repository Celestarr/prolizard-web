import rootReducer from "busan/reducers";
import {
  applyMiddleware,
  compose,
  createStore,
} from "redux";
import thunkMiddleware from "redux-thunk";

/* eslint-disable no-underscore-dangle */
// This enables the redux dev tools extension, or does nothing if not installed
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export default createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunkMiddleware),
  ),
);
