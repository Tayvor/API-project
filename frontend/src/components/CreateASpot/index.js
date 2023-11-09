import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as spotActions from '../../store/spots';

import './CreateASpot.css';

export default function CreateASpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState(20);
  const [longitude, setLongitude] = useState(20);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [imgUrl1, setImgUrl1] = useState('');
  const [imgUrl2, setImgUrl2] = useState('');
  const [imgUrl3, setImgUrl3] = useState('');
  const [imgUrl4, setImgUrl4] = useState('');
  const [imgUrl5, setImgUrl5] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSpotInfo = {
      address: streetAddress,
      city: city,
      country: country,
      state: state,
      lat: latitude,
      lng: longitude,
      name: title,
      description: description,
      price: Number(price),
    }

    return dispatch(spotActions.createASpot(newSpotInfo))
      .catch(async (data) => {
        const problem = await data.json();
        // await setErrors(problem.errors)
        console.log(problem)
      })
    // .then(errors ? console.log(errors, '****') : history.push('/'))
    // .then(
    //   setCountry(''),
    //   setStreetAddress(''),
    //   setCity(''),
    //   setState(''),
    //   setLatitude(0),
    //   setLongitude(0),
    //   setDescription(''),
    //   setTitle(''),
    //   setPrice(0),
    //   setImgUrl1(''),
    //   setImgUrl2(''),
    //   setImgUrl3(''),
    //   setImgUrl4(''),
    //   setImgUrl5(''),
    // )
  }

  return (
    <>
      <form className="newSpotForm" onSubmit={handleSubmit}>

        <h2>Create a new Spot</h2>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>

        <label>
          Country
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></input>
        </label>
        <label>
          Street Address
          <input
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          ></input>
        </label>
        <label>
          City
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></input>
        </label>
        <label>
          State
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
          ></input>
        </label>
        <label>
          Latitude
          <input
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          ></input>
        </label>
        <label>
          Longitude
          <input
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          ></input>
        </label>

        <h3>Describe your place to guests</h3>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>

        <h3>Create a title for your spot</h3>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </label>

        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <label>
          $<input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          ></input>
        </label>

        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <label>
          <input
            value={imgUrl1}
            onChange={(e) => setImgUrl1(e.target.value)}
          ></input>
        </label>
        <label>
          <input
            value={imgUrl2}
            onChange={(e) => setImgUrl2(e.target.value)}
          ></input>
        </label>
        <label>
          <input
            value={imgUrl3}
            onChange={(e) => setImgUrl3(e.target.value)}
          ></input>
        </label>
        <label>
          <input
            value={imgUrl4}
            onChange={(e) => setImgUrl4(e.target.value)}
          ></input>
        </label>
        <label>
          <input
            value={imgUrl5}
            onChange={(e) => setImgUrl5(e.target.value)}
          ></input>
        </label>


        <button disabled={errors.length ? true : false}>Create Spot</button>
      </form>
    </>
  )
}
