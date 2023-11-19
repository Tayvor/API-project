import { useDispatch } from 'react-redux';
import * as spotActions from '../../store/spots';
import './DeleteReviewModal.css'
import { useModal } from '../../context/Modal';

export default function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const deleteReview = (e) => {
    e.preventDefault();
    dispatch(spotActions.deleteReviewById(reviewId));
    closeModal();
    return
  }

  return (
    <>
      <h2 className='confirmDel'>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>

      <button
        onClick={deleteReview}
        className="redBtn clickable"
      >Yes (Delete Review)</button>

      <button
        className="greyBtn clickable"
        onClick={closeModal}
      >No (Keep Review)</button>
    </>
  )
}
