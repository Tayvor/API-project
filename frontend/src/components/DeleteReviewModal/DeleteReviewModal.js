import { useDispatch } from 'react-redux';
import { deleteReviewById } from '../../store/spots';
import * as spotActions from '../../store/spots';
import './DeleteReviewModal.css'

export default function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();

  const deleteReview = (e) => {
    e.preventDefault();
    return dispatch(spotActions.deleteReviewById(reviewId));
  }

  return (
    <>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>

      <button
        onClick={deleteReview}
        className="redBtn"
      >Yes (Delete Review)</button>

      <button
        className="greyBtn"
      >No (Keep Review)</button>
    </>
  )
}
