import { csrfFetch } from './csrf';

const GET_SPOTS = 'GET_SPOTS';

const showSpots = (allSpots) => {
  return {
    type: GET_SPOTS,
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

  return res;
}

const spotReducer = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case GET_SPOTS:
      const spots = [...action.spots];
      spots.map((spot) => newState[spot.id] = spot);
      return newState;

    default:
      return state;
  }
}

export default spotReducer;
