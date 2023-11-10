import { csrfFetch } from './csrf';

const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';

const getSpots = (allSpots) => {
  return {
    type: GET_SPOTS,
    spots: allSpots
  }
}

const getASpot = (spot) => {
  return {
    type: GET_SPOT_BY_ID,
    spotDetails: spot
  }
}

// Get All Spots
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots');
  const data = await res.json();
  dispatch(getSpots(data.Spots));
  return res;
}

// Get Spot by Id
export const getSpotById = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`);
  if (res.ok) {
    const data = await res.json()
    dispatch(getASpot(data));
    return res;
  }
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

    case GET_SPOT_BY_ID:
      newState = { ...state };
      newState.spotDetails = { ...action.spotDetails }
      return newState;

    default:
      return state;
  }
}

export default spotReducer;