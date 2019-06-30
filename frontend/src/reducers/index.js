import { GET_VIDEOS, GET_VIDEO, UPDATE_VIDEO, DELETE_VIDEO } from '../actions/types';

const initialState = {

}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case GET_VIDEOS:
        return { ...state, ...payload }

    default:
        return state
    }
}
