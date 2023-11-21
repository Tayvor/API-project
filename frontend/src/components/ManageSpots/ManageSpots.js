import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import blueHouse from './blueHouse.avif'
import './ManageSpots.css'

import * as spotActions from '../../store/spots';

import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

export default function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);

  const currUserSpots = useSelector((state) => state.spots.userSpots);

  useEffect(() => {
    dispatch(spotActions.getSpotsByCurrUser())
      .catch(async (data) => {
        // const problem = await data.json()
        console.log(data, '<=== Data ===')
        return data;
      })
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  return (
    <>
      <h2>Manage Spots</h2>
      {!Object.values(currUserSpots).length ? <button onClick={() => history.push('/spots/new')}>Create a New Spot</button> : ''}
      {isLoaded && currUserSpots && (
        <div className='userSpots'>
          {Object.values(currUserSpots).map((spot) =>
            <div
              key={spot.id}
              className='userSpot'
            >
              <img
                className='spotImg'
                onClick={() => history.push(`/spots/${spot.id}`)}
                src={spot.previewImage || blueHouse}
                style={{ height: 260, width: 270, borderRadius: 15 }}
              ></img>

              <div className="cityStateStar">
                <div>{`${spot.city}, ${spot.state}`}</div>
                <i className="fas fa-star">
                  {spot.avgRating ?
                    ` ${spot.avgRating.toFixed(1)}` : ' New'}
                </i>
              </div>
              <span>{`$${spot.price} night`}</span>

              <div
                className='updateDeleteDiv'
              >
                <button
                  className='editSpotBtn'
                  onClick={() => history.push(`/spots/${spot.id}/edit`)}
                >Update
                </button>

                <OpenModalMenuItem
                  itemText="Delete"
                  modalComponent={<DeleteSpotModal spotId={spot.id} />}
                />
              </div>
            </div>
          )}
        </div>
      )
      }
    </>
  )
}
