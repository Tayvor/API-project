import { useDispatch } from 'react-redux';

import './DeleteSpotModal.css';
import * as spotActions from '../../store/spots';
import { useModal } from '../../context/Modal';

export default function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteSpot = async (e) => {
    e.preventDefault();
    dispatch(spotActions.deleteSpot(spotId));
    closeModal();
    return;
  }

  return (
    <>
      <h1 className='confirmDel-header'>Confirm Delete</h1>
      <p className='confirmDel-desc'>Are you sure you want to remove this spot from the listings?</p>
      <div className="deleteSpotBtns">
        <button
          className='yesDelete clickable'
          onClick={deleteSpot}
        >Yes (Delete Spot)
        </button>
        <button
          className='noKeep clickable'
          onClick={closeModal}
        >No (Keep Spot)</button>
      </div>
    </>
  )
}
