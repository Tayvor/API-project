import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import * as spotActions from '../../store/spots';

import './Spots.css'
import blueHouse from './images/blueHouse.avif';

export default function Spots() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getAllSpots())
      // .catch(async (data) => {
      //   const problem = await data.json();
      //   console.log(problem)
      // })
      // .then(dispatch(spotActions.getSpotsByCurrUser()))
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  const allSpots = Object.values(useSelector((state) => state.spots.spots));

  return (
    <>
      {
        isLoaded && (
          <div className="allSpots">
            {allSpots.map((spot) =>

              <div
                key={spot.id}
                className="spot"
                onClick={(e) => history.push(`/spots/${spot.id}`)}
              >
                <img src={blueHouse} style={{ height: 260, width: 270, borderRadius: 15 }}></img>
                {`${spot.city}, ${spot.state}`}
                <span>{`$${spot.price} night`}</span>
              </div>
            )}
          </div>
        )
      }

    </>
  )
}
