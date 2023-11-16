import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import * as spotActions from '../../store/spots';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

import BlueHouse from './blueHouse.avif';
import './SpotDetails.css';
import CreateReview from "../CreateReview/CreateReview";



export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [starAvg, setStarAvg] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [currUserReview, setCurrUserReview] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getSpotById(spotId))
      .then(() => dispatch(spotActions.getReviewsBySpotId(spotId)))
      .then(() => setIsLoaded(true));
  }, [dispatch])

  const theSpot = useSelector((state) => state.spots.currSpot)
  const theReviews = useSelector((state) => state.spots.currSpotReviews);
  const currUser = useSelector((state) => state.session.user);

  useEffect(() => {
    setNumReviews(0);
    setStarAvg(0);
    setCurrUserReview(false);

    if (theReviews) {
      let reviewCount = 0;
      let starSum = 0;

      Object.values(theReviews).map((review) => {
        reviewCount += 1;
        starSum += review.stars;

        if (currUser) {
          if (theSpot.ownerId === currUser.id ||
            review.User.id === currUser.id
          ) {
            setCurrUserReview(true)
          }
        }
      });

      const avgStars = (starSum / reviewCount);
      setStarAvg(avgStars);
      setNumReviews(reviewCount);
    }
  }, [theReviews])


  return (
    <>
      {isLoaded &&
        <div className="spotDetails">
          <section className="spotDetailsHeader">
            <h2>{theSpot ? `${theSpot.name}` : 'Loading spot name...'}</h2>
            <div>
              {theSpot ? `${theSpot.city}, ${theSpot.state}, ${theSpot.country}` : ''}
            </div>
          </section>

          <img src={BlueHouse}></img>

          <section className="spotDetailsFooter">
            <div>
              <div>{theSpot ? `Hosted by ${theSpot.Owner.firstName} ${theSpot.Owner.lastName}` : ''}</div>
              <div>{theSpot ? `${theSpot.description}` : ''}</div>
            </div>

            <div className="spotDetailsReserveBox">
              <div className="reserveBoxTop">{theSpot ? `$${theSpot.price} night` : ''}
                <div>
                  <i className="fas fa-star">{starAvg ? ` ${starAvg}` : ' New'}</i>
                  {numReviews > 1 ? ` - ${numReviews} reviews` : ''}
                  {numReviews === 1 ? ` - ${numReviews} review` : ''}
                </div>
              </div>
              <button
                onClick={() => window.alert('Feature Coming Soon...')}
                className="reserveBtn"
              >Reserve</button>
            </div>
          </section>

          <section className="spotDetailsReviews">
            <div>
              <i className="fas fa-star">{starAvg ? ` ${starAvg}` : ' New'}</i>
              {numReviews > 1 ? ` - ${numReviews} reviews` : ''}
              {numReviews === 1 ? ` - ${numReviews} review` : ''}
            </div>

            {currUser && !currUserReview && currUser.id !== theSpot.ownerId ?
              <OpenModalMenuItem
                itemText='Post Your Review'
                modalComponent={<CreateReview spotId={theSpot.id} />} />
              : ''
            }
            {currUser && numReviews === 0 && currUser.id !== theSpot.ownerId ? <div>Be the first to post a review!</div> : ''}

            <div className="spotReviews">
              {Object.values(theReviews).map((review) =>
                <div
                  key={review.id}
                  className="review"
                >
                  <hr width='100%' />
                  <div>{review.User.firstName}</div>
                  <div>{`${review.updatedAt.split('-')[1]}, ${review.updatedAt.split('-')[0]}`}</div>
                  <div>{review.review}</div>
                </div>
              )}
            </div>
          </section >
        </div >
      }
    </>
  )
}
