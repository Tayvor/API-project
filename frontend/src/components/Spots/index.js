import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import * as spotActions from '../../store/spots';
import blueHouse from './images/blueHouse.avif';
import './Spots.css'


export default function Spots() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getAllSpots())
      .catch(async (data) => {
        const problem = await data.json();
        return problem;
      })
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  const allSpots = Object.values(useSelector((state) => state.spots.spots));
  // console.log(allSpots)

  return (
    <>
      {isLoaded && (
        <div className="spots-ctn">
          {allSpots.map((spot) =>
            <div
              key={spot.id}
              className="spot"
              onClick={(e) => history.push(`/spots/${spot.id}`)}
            >

              <img
                title={`${spot.name}`}
                src={spot.previewImage || blueHouse}
                className="spotImg"
              ></img>

              <div className="spot-footer">
                <div>{`${spot.city}, ${spot.state}`}</div>
                <i className="fas fa-star">
                  {spot.avgRating ?
                    ` ${spot.avgRating.toFixed(1)}` : ' New'}
                </i>
              </div>
              <span>{`$${spot.price.toFixed(2)} night`}</span>
            </div>
          )}
        </div>
      )
      }

    </>
  )
}
