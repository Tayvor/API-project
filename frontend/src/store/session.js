import { csrfFetch } from "./csrf";

const ADD_SESSION_USER = 'ADD_SESSION_USER';
const REMOVE_SESSION_USER = 'REMOVE_SESSION_USER';

const addSessionUser = (user) => {
  return {
    type: ADD_SESSION_USER,
    user
  }
};

const removeSessionUser = (user) => {
  return {
    type: REMOVE_SESSION_USER,
  }
};

// Login User
export const loginUser = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();

    dispatch(addSessionUser(data.user));
    return response;
  }
};

// Restore User session
export const restoreSessionUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(addSessionUser(data.user));
  return response;
};

// Signup User
export const signupUser = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    })
  });

  const data = await res.json();
  dispatch(addSessionUser(data.user));
  return res;
};

// Logout User
export const logoutUser = (user) => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeSessionUser());
  return res;
}


const initialState = { user: null }

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_SESSION_USER:
      newState = { ...state };
      newState.user = action.user;
      return newState;

    case REMOVE_SESSION_USER:
      newState = { ...state }
      newState.user = null;
      return newState;

    default:
      return state;
  }
};

export default sessionReducer;
