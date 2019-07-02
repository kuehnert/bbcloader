import _ from 'lodash';
import { GET_VIDEOS, GET_VIDEO, CREATE_VIDEO, UPDATE_VIDEO, DELETE_VIDEO } from '../actions/types';

export default (state = {}, { type, payload }) => {
	switch (type) {
		case GET_VIDEOS:
			return { ...state, ..._.mapKeys(payload, 'id') };

		case GET_VIDEO:
		case UPDATE_VIDEO:
			return { ...state, [payload.id]: payload };

		case CREATE_VIDEO:
			if (Array.isArray(payload)) {
				// multiple videos
				return { ...state, ..._.mapKeys(payload, 'id') };
			} else {
				// single video
				return { ...state, [payload.id]: payload };
			}

		case DELETE_VIDEO:
			return _.omit(state, payload);

		default:
			return state;
	}
};
