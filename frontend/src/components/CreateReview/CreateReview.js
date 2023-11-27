import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { csrfFetch } from '../../store/csrf';
import * as spotActions from '../../store/spots';
import { useModal } from '../../context/Modal';
import './CreateReview.css'

export default function CreateReview({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(1);

  const submitReview = async () => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        review: reviewText,
        stars: starRating
      }),
      Headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => dispatch(spotActions.getReviewsBySpotId(spotId)))
    closeModal();

    return res;
  }

  return (
    <div className='reviewModal'>
      <h2>How was your stay?</h2>

      <textarea
        className='reviewTextArea'
        onChange={(e) => setReviewText(e.target.value)}
        placeholder='Leave your review here...'
      ></textarea>

      <div className='starsContainer'>
        <div className="stars">
          <i
            className="fas fa-star revStar lit"
            onClick={() => setStarRating(1)}
          ></i>
          <i
            className={`fas fa-star revStar ${starRating > 1 ? 'lit' : ''}`}
            onClick={() => setStarRating(2)}
          ></i>
          <i
            className={`fas fa-star revStar ${starRating > 2 ? 'lit' : ''}`}
            onClick={() => setStarRating(3)}
          ></i>
          <i
            className={`fas fa-star revStar ${starRating > 3 ? 'lit' : ''}`}
            onClick={() => setStarRating(4)}
          ></i>
          <i
            className={`fas fa-star revStar ${starRating > 4 ? 'lit' : ''}`}
            onClick={() => setStarRating(5)}
          ></i>
          <span>{` Stars`}</span>
        </div>
      </div>

      <button
        className={reviewText.length >= 10 ? 'submitReviewBtn clickable' : 'submitReviewBtn disabled'}
        onClick={submitReview}
        disabled={reviewText.length >= 10 ? false : true}
      >Submit Your Review
      </button>
    </div>
  )
}
