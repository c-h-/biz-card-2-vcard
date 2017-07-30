import {
  REHYDRATE,
} from 'redux-persist/constants';

import ActionTypes from '../../redux/action_types.json';

const initState = {
  cards: [],
};

export default function home(state = initState, action) {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...action.payload.home,
      };
    }
    case ActionTypes.SAVE_CARD: {
      return {
        ...state,
        cards: [
          ...state.cards,
          action.payload,
        ],
      };
    }
    default:
      return state;
  }
}
