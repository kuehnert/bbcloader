import { combineReducers } from 'redux';

import videoReducer from './videoReducer';
import statusReducer from './statusReducer';

export default combineReducers({
	status: statusReducer,
	videos: videoReducer,
});
