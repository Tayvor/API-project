import { csrfFetch } from './csrf';

const GET_SPOTS = 'GET_SPOTS';
const GET_SPOT_BY_ID = 'GET_SPOT_BY_ID';
const GET_SPOT_BY_USER = 'GET_SPOT_BY_USER';
const DELETE_SPOT = 'DELETE_SPOT';
const GET_REVIEWS = 'GET_REVIEWS';
const DELETE_REVIEW = 'DELETE_REVIEW';

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

const deleteSpotById = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId: spotId
  }
}

const getSpotReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews: reviews
  }
}

const deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId: reviewId
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
    return data;
  }
  return res;
}

// Get Spots Belonging to Curr User
export const getSpotsByCurrUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current');
  if (res.ok) {
    const data = await res.json()
    dispatch(getSpotsByUser(data));
    return data;
  }
  return res;
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
  const data = await res.json();
  // dispatch(getSpots(data.Spots));
  return data;
}

// Update a Spot
export const updateASpot = (updatedSpotInfo) => async (dispatch) => {
  const { spotId, address, city, country, state, lat, lng, name, description, price } = updatedSpotInfo;
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
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
  const data = await res.json();
  // getAllSpots();
  return data;
}

// Delete a Spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  })
    .then(dispatch(deleteSpotById(spotId)))
    .catch(async (err) => {
      const error = await err.json();
      return error;
    })
  return res;
}

// Get Reviews by Spot Id
export const getReviewsBySpotId = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
  if (res.ok) {
    const data = await res.json()
    const reviews = await dispatch(getSpotReviews(data.Reviews))
    return reviews;
  }
  return res;
}

export const deleteReviewById = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
    .then(dispatch(deleteReview(reviewId)))
    .catch(async (err) => {
      const error = await err.json();
      return error;
    })
  return res;
}

const spotReducer = (state = { spots: {}, currSpot: {}, userSpots: {}, currSpotReviews: {} }, action) => {
  let newState = {};
  switch (action.type) {
    case GET_SPOTS:
      newState = { ...state };
      const spots = [...action.spots];
      spots.map((spot) => newState.spots[spot.id] = spot);
      return newState;

    case GET_SPOT_BY_ID:
      newState = { ...state };
      newState.currSpot = { ...action.spotDetails }
      return newState;

    case GET_SPOT_BY_USER:
      newState = { ...state };
      newState.userSpots = {};
      const currUserSpots = [...action.payload.Spots];
      currUserSpots.map((spot) => newState.userSpots[spot.id] = spot)
      return newState;

    case DELETE_SPOT:
      const userSpots = { ...state.userSpots };
      delete userSpots[action.spotId];
      const newSpots = { ...state.spots };
      delete newSpots[action.spotId];
      state.spots = newSpots;
      return { ...state, userSpots };

    case GET_REVIEWS:
      newState = { ...state };
      newState.currSpotReviews = {};
      const theReviews = [...action.reviews];
      theReviews.map((review) => newState.currSpotReviews[review.id] = review)
      return newState;

    case DELETE_REVIEW:
      const currSpotReviews = { ...state.currSpotReviews };
      delete currSpotReviews[action.reviewId];
      return { ...state, currSpotReviews }

    default:
      return state;
  }
}

export default spotReducer;
