import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import * as spotActions from '../../store/spots';

import BlueHouse from './blueHouse.avif';
import './SpotDetails.css';



export default function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(spotActions.getSpotById(spotId));
  }, [dispatch])

  const theSpot = useSelector((state) => state.spots.spotDetails)

  return (
    <>
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
              <div>*icon #.# - # reviews</div>
            </div>
            <button className="reserveBtn">Reserve</button>
          </div>
        </section>

        <section className="spotDetailsReviews">
          <div>*icon #.# - # reviews</div>
          <button className="postReviewBtn">Post Your Review</button>
          <div className="spotReviews">
            <div>firstName</div>
            <div>Month / Year</div>
            <div>the review ...</div>
          </div>
        </section>
      </div>
    </>
  )
}
