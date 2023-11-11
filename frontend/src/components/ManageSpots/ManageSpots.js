import { useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import blueHouse from './blueHouse.avif'
import './ManageSpots.css'

import * as spotActions from '../../store/spots';

export default function ManageSpots() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [userSpots, setUserSpots] = useState([]);
  const [editSpotUrl, setEditSpotUrl] = useState('');

  useEffect(() => {
    dispatch(spotActions.getSpotsByCurrUser())
      .catch(async (problem) => {
        console.log(problem, '<=== PROBLEM ===');
        return problem;
      })
      .then((data) => setUserSpots(data.Spots))
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  useEffect(() => {
    if (editSpotUrl.length) {
      history.push(editSpotUrl);
    }
  }, [editSpotUrl])

  return (
    <>
      <h2>Manage Your Spots</h2>
      <button>Create a New Spot</button>
      {isLoaded && (
        <div className='userSpots'>
          {userSpots.map((spot) =>
            <div
              key={spot.id}
              className='userSpot'
            // onClick={(e) => history.push(`/spots/${spot.id}`)}
            >
              <img src={blueHouse} style={{ height: 260, width: 270, borderRadius: 15 }}></img>
              {`${spot.city}, ${spot.state}`}
              <span>{`$${spot.price} night`}</span>
              <span>{spot.id}</span>
              <div className='updateDeleteDiv'>
                <button
                  className='editSpotBtn'
                  onClick={(e) => setEditSpotUrl(`/spots/${spot.id}/edit`)}
                >Update
                </button>
                <button>Delete</button>
              </div>
            </div>
          )}
        </div>
      )
      }
    </>
  )
}
