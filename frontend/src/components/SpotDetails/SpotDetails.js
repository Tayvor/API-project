import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import './SpotDetails.css';
import BlueHouse from './blueHouse.avif'
import { csrfFetch } from "../../store/csrf";


export default function SpotDetails() {
  const { spotId } = useParams();
  const theSpot = useSelector((state) => state.spots[spotId]);

  // Need to grab owner associated with 'theSpot'
  // const theSpot = await csrfFetch(`/spots/${spotId}`)

  // console.log(theSpot, '*********')

  return (
    <>
      <h2>{theSpot.name}</h2>
      <div>{`${theSpot.city}, ${theSpot.state}, ${theSpot.country}`}</div>
      <img src={BlueHouse}></img>
      <div>{`Hosted by `}</div>
    </>
  )
}
