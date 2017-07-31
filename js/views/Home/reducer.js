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
    case ActionTypes.REMOVE_CARD: {
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload.id),
      };
    }
    case ActionTypes.SAVE_CARD: {
      return {
        ...state,
        cards: [
          ...state.cards,
          {
            ...action.payload,
            id: `${new Date().getTime()}${Math.floor(Math.random() * 1e3)}`
          },
        ],
      };
    }
    default:
      return state;
  }
}
