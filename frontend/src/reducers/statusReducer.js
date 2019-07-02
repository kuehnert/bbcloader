import { GET_STATUS } from '../actions/types';

const initialState = {
	externalIP: null,
	isOnline: null,
	currentVideo: null,
	lastCheck: null,
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_STATUS:
			return { ...state, ...payload };

		default:
			return state;
	}
};
