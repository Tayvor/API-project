import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { csrfFetch } from "../../store/csrf";
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
  const [price, setPrice] = useState();

  const [imgUrl1, setImgUrl1] = useState('');
  const [imgUrl2, setImgUrl2] = useState('');
  const [imgUrl3, setImgUrl3] = useState('');
  const [imgUrl4, setImgUrl4] = useState('');
  const [imgUrl5, setImgUrl5] = useState('');

  const [errors, setErrors] = useState({});
  let spotId;

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    setErrors({});

    if (!country) errors.country = 'is required!';
    if (!streetAddress) errors.streetAddress = 'is required!';
    if (!city) errors.city = 'is required!';
    if (!state) errors.state = 'is required!';
    if (description.length < 30) errors.description = 'must be at least 30 characters!'
    if (!description) errors.description = 'is required!';
    if (!title) errors.title = 'is required!';
    if (!price) errors.price = 'is required!';
    if (!imgUrl1) errors.imgUrl1 = 'is required!';

    if (parseInt(price) <= 0) errors.price = 'must be greater than zero!'

    setErrors(errors);

    if (Object.keys(errors).length) {
      return errors;
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const newSpotInfo = {
      address: streetAddress,
      city: city,
      state: state,
      country: country,
      lat: Number(latitude),
      lng: Number(longitude),
      name: title,
      description: description,
      price: Number(price),
    }

    return dispatch(spotActions.createASpot(newSpotInfo))
      .catch(async (problem) => {
        return problem;
      })
      .then(async (spot) => {
        const { id } = spot;

        const addPreviewImg = await csrfFetch(`/api/spots/${id}/images`, {
          method: 'POST',
          Headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'url': imgUrl1,
            'preview': true
          })
        })

        spotId = id;
        return addPreviewImg;
      })
      .catch(async (err) => {
        const data = await err.json();
        return data;
      })
      .then(() => history.push(`/spots/${spotId}`))
  };

  return (
    <form className="newSpotForm">

      <h2>Create a New Spot</h2>

      <h3>Where's your place located?</h3>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      <section className="newSpotLocation">

        <label className={errors.country ? 'required' : ''}>
          {errors.country ? `Country ${errors.country}` : 'Country'}
          <input
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          ></input>
        </label>

        <label className={errors.streetAddress ? 'required' : ''}>
          {errors.streetAddress ? `Street Address ${errors.streetAddress}` : 'Street Address'}
          <input
            value={streetAddress}
            placeholder="Address"
            onChange={(e) => setStreetAddress(e.target.value)}
          ></input>
        </label>

        <div className="cityStateDiv">
          <label className={errors.city ? 'required' : ''}>
            {errors.city ? `City ${errors.city}` : 'City'}
            <input
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            ></input>
          </label>

          <label className={errors.state ? 'required' : ''}>
            {errors.state ? `State ${errors.state}` : 'State'}
            <input
              value={state}
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            ></input>
          </label>
        </div>

        <div className="latLngInputs hidden">
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
        </div>
      </section>

      <hr width='100%' className="newSpotHr" />

      <h3>Describe your place to guests</h3>
      <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
      <section className="newSpotDescription">

        <label className={errors.description ? 'required' : ''}>
          {errors.description ? `Description ${errors.description}` : ''}
          <textarea
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
      </section>

      <hr width='100%' className="newSpotHr" />

      <h3>Create a title for your spot</h3>
      <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
      <section className="newSpotTitle">

        <label className={errors.title ? 'required' : ''}>
          {errors.title ? `Title ${errors.title}` : ''}
          <input
            placeholder="Name of your spot"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </label>
      </section>

      <hr width='100%' className="newSpotHr" />

      <h3>Set a base price for your spot</h3>
      <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
      <section className="newSpotPrice">

        <label className={errors.price ? 'required' : ''}>
          {errors.price ? `Price ${errors.price}` : ''}
          <div>
            $
            <input
              placeholder="Price per night (USD)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></input>
          </div>
        </label>
      </section>

      <hr width='100%' className="newSpotHr" />

      <h3>Liven up your spot with photos</h3>
      <p>Submit a link to at least one photo to publish your spot.</p>
      <section className="newSpotImages">

        {errors.imgUrl1 ?
          <div className={errors.imgUrl1 ? 'required' : ''}>
            {`Preview image ${errors.imgUrl1}`}
          </div>
          : ''
        }
        <label>
          <input
            placeholder="Preview Image URL"
            value={imgUrl1}
            onChange={(e) => setImgUrl1(e.target.value)}
          ></input>
        </label>

        <label>
          <input
            placeholder="Image URL"
            value={imgUrl2}
            onChange={(e) => setImgUrl2(e.target.value)}
            disabled={imgUrl1 ? false : true}
          ></input>
        </label>

        <label>
          <input
            placeholder="Image URL"
            value={imgUrl3}
            onChange={(e) => setImgUrl3(e.target.value)}
            disabled={imgUrl2 ? false : true}
          ></input>
        </label>

        <label>
          <input
            placeholder="Image URL"
            value={imgUrl4}
            onChange={(e) => setImgUrl4(e.target.value)}
            disabled={imgUrl3 ? false : true}
          ></input>
        </label>

        <label>
          <input
            placeholder="Image URL"
            value={imgUrl5}
            onChange={(e) => setImgUrl5(e.target.value)}
            disabled={imgUrl4 ? false : true}
          ></input>
        </label>
      </section>

      <hr width='100%' className="newSpotHr" />

      <div className="createSpotDiv">
        <button
          className="createSpotBtn"
          type="submit"
          onClick={validate}
        >Create Spot
        </button>
      </div>
    </form>
  )
}
