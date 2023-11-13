import { useDispatch } from 'react-redux';
// import { csrfFetch } from "../../store/csrf";

import './DeleteSpotModal.css';
import * as spotActions from '../../store/spots';

export default function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  // console.log(spotId, '<=== spotId ===');

  const deleteSpot = async (e) => {
    return dispatch(spotActions.deleteSpot(spotId));
  }

  return (
    <>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <div className="deleteSpotBtns">
        <button
          onClick={deleteSpot}
        >Yes (Delete Spot)
        </button>
        <button>No (Keep Spot)</button>
      </div>
    </>
  )
}
