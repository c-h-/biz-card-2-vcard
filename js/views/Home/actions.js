import ActionTypes from '../../redux/action_types.json';

export function saveCard(data = {}) {
  return {
    type: ActionTypes.SAVE_CARD,
    payload: {
      ...data,
    },
  };
}

export function removeCard(id) {
  return {
    type: ActionTypes.REMOVE_CARD,
    payload: {
      id,
    },
  };
}
