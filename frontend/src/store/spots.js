import { csrfFetch } from './csrf';

const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';
const GET_SPOT_BY_USER = 'GET_SPOT_BY_USER';

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

const getSpotsByUser = (currUserSpots) => {
  return {
    type: GET_SPOT_BY_USER,
    payload: currUserSpots
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

export const getSpotsByCurrUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current');
  if (res.ok) {
    const data = await res.json()
    dispatch(getSpotsByUser(data));
    return res;
  }
}

// Create A Spot
export const createASpot = (newSpotInfo) => async (dispatch) => {
  const { address, city, country, state, lat, lng, name, description, price } = newSpotInfo;
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    }),
    Headers: {
      'Content-Type': 'application/json'
    }
  });
  // const data = await res.json();
  // dispatch(getSpots(data.Spots));
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

    case GET_SPOT_BY_USER:
      newState = { ...state };
      newState.userSpots = { ...action.payload }
      return newState;

    default:
      return state;
  }
}

export default spotReducer;
