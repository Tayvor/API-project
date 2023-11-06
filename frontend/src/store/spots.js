import { csrfFetch } from './csrf';

const SHOW_SPOTS = 'SHOW_SPOTS';

const showSpots = (allSpots) => {
  return {
    type: SHOW_SPOTS,
    spots: allSpots
  }
}

// Get All Spots
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');
  const data = await res.json();
  dispatch(showSpots(data.Spots));
  return res;
}

const spotReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case SHOW_SPOTS:
      newState = { ...action.spots };
      return newState;

    default:
      return state;
  }
}

export default spotReducer;
