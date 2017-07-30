import ActionTypes from '../../redux/action_types.json';

export function saveCard(data = {}) {
  return {
    type: ActionTypes.SAVE_CARD,
    payload: {
      ...data,
    },
  };
}
