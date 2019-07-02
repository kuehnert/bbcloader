import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import videoReducer from './videoReducer';
import statusReducer from './statusReducer';

export default combineReducers({
	form: formReducer,
	status: statusReducer,
	videos: videoReducer,
});
