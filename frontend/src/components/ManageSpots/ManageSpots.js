import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import blueHouse from './blueHouse.avif'

import * as spotActions from '../../store/spots';

export default function ManageSpots() {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getSpotsByCurrUser())
      .catch(async (problem) => {
        console.log(problem, '<=== PROBLEM ===')
      })
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  return (
    <>
      <h2>Manage Your Spots</h2>
      {/* <button>Create a New Spot</button> */}
      {isLoaded && (
        <div>
          {

            <img src={blueHouse} style={{ height: 260, width: 270, borderRadius: 15 }}></img>
          }
        </div>
      )
      }
    </>
  )
}
