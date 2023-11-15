import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import * as spotActions from '../../store/spots';

import BlueHouse from './blueHouse.avif';
import './SpotDetails.css';



export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [starAvg, setStarAvg] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  useEffect(() => {
    dispatch(spotActions.getSpotById(spotId))
      .then(() => dispatch(spotActions.getReviewsBySpotId(spotId)))
      .then(() => setIsLoaded(true));
  }, [dispatch])

  const theSpot = useSelector((state) => state.spots.currSpot)
  const theReviews = useSelector((state) => state.spots.currSpotReviews);
  // console.log(theReviews, '<=== Reviews ===');

  useEffect(() => {
    setNumReviews(0);
    setStarAvg(0);

    if (theReviews) {
      let reviewCount = 0;
      let starSum = 0;

      Object.values(theReviews).map((review) => {
        reviewCount += 1;
        starSum += review.stars;
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
                  <i className="fas fa-star">{` ${starAvg}`}</i>
                  {numReviews > 1 ? ` - ${numReviews} reviews` : ` - ${numReviews} review`}
                </div>
              </div>
              <button className="reserveBtn">Reserve</button>
            </div>
          </section>

          <section className="spotDetailsReviews">
            <div>
              <i className="fas fa-star">{` ${starAvg}`}</i>
              {numReviews > 1 ? ` - ${numReviews} reviews` : ` - ${numReviews} review`}
            </div>
            <button className="postReviewBtn">Post Your Review</button>

            <div className="spotReviews">
              <div>firstName</div>
              <div>Month / Year</div>
              <div>the review ...</div>
            </div>
          </section>
        </div>
      }
    </>
  )
}
