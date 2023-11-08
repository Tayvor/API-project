import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as spotActions from '../../store/spots';
import './Spots.css'
import blueHouse from './images/blueHouse.avif';

export default function Spots() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getAllSpots())
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  const allSpots = Object.values(useSelector((state) => state.spots));

  return (
    <>
      {isLoaded && (
        <div className="allSpots">
          {allSpots.map((spot) =>

            <div
              key={spot.id}
              className="spot"
            >
              <img src={blueHouse} style={{ height: 260, width: 270, borderRadius: 15 }}></img>
              {`${spot.city}, ${spot.state}`}
              <span>{`$${spot.price} night`}</span>
            </div>
          )}
        </div>
      )}
    </>
  )
}
