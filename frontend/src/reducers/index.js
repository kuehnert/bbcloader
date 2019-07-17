import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import errorReducer from './errorReducer';
import videoReducer from './videoReducer';
import statusReducer from './statusReducer';

export default combineReducers({
	form: formReducer,
	errors: errorReducer,
	status: statusReducer,
	videos: videoReducer,
});
