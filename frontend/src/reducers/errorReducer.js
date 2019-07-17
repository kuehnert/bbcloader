import { ADD_ERROR, REMOVE_ERROR } from '../actions/types';

export default (state = [], { type, error, index }) => {
  switch (type) {
    case ADD_ERROR:
      return [...state, error];

    case REMOVE_ERROR:
      return state.filter((error, i) => i !== index);

    default:
      return state;
  }
};
