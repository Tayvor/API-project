import { csrfFetch } from './csrf';

const SHOW_SPOTS = 'SHOW_SPOTS';
const CREATE_SPOT = 'CREATE_SPOT';

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

// Create A Spot
export const createASpot = (newSpotInfo) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify({ ...newSpotInfo }),
  });
  // const data = await res.json();
  // console.log(data, '**************')
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
