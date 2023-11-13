import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as spotActions from '../../store/spots';

import './UpdateSpot.css';

export default function CreateASpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  let theSpot;

  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [latitude, setLatitude] = useState(20);
  const [longitude, setLongitude] = useState(20);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [imgUrl1, setImgUrl1] = useState('fix me');
  const [imgUrl2, setImgUrl2] = useState('');
  const [imgUrl3, setImgUrl3] = useState('');
  const [imgUrl4, setImgUrl4] = useState('');
  const [imgUrl5, setImgUrl5] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getSpotById(spotId))
      .then((spot) => theSpot = spot)
      .then(() => setIsLoaded(true))
      .then(() => {
        setStreetAddress(theSpot.address)
        setCity(theSpot.city)
        setState(theSpot.state)
        setCountry(theSpot.country)
        setDescription(theSpot.description)
        setLatitude(theSpot.lat)
        setLongitude(theSpot.lng)
        setTitle(theSpot.name)
        setPrice(theSpot.price)
      })
  }, [dispatch])

  const validate = (e) => {
    e.preventDefault();
    const errors = {};
    setErrors({});

    if (!country) errors.country = 'is required!';
    if (!streetAddress) errors.streetAddress = 'is required!';
    if (!city) errors.city = 'is required!';
    if (!state) errors.state = 'is required!';
    if (!description) errors.description = 'is required!';
    if (!title) errors.title = 'is required!';
    if (!price) errors.price = 'is required!';
    if (!imgUrl1) errors.imgUrl1 = 'is required!';

    setErrors(errors);

    if (Object.keys(errors).length) {
      console.log(errors, '<=== errors ===');
      return errors;
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const updatedSpotInfo = {
      spotId: spotId,
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

    return dispatch(spotActions.updateASpot(updatedSpotInfo))
      .catch(async (problem) => {
        console.log(problem, '<=== Problem ===');
        return problem;
      })
      .then((spot) => {
        const { id } = spot;
        history.push(`/spots/${id}`)
      })
  };

  return (
    <>
      {isLoaded &&
        <form className="updateSpotForm">
          <h2>Update Your Spot</h2>
          <h3>Where's your place located?</h3>
          <p>Guests will only get your exact address once they booked a reservation.</p>

          <label className={errors.country ? 'required' : ''}>
            {errors.country ? `Country ${errors.country}` : 'Country'}
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></input>
          </label>

          <label className={errors.streetAddress ? 'required' : ''}>
            {errors.streetAddress ? `Street Address ${errors.streetAddress}` : 'Street Address'}
            <input
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            ></input>
          </label>

          <div className="cityStateInputs">
            <label className={errors.city ? 'required' : ''}>
              {errors.city ? `City ${errors.city}` : 'City'}
              <input
                className="cityInput"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              ></input>
            </label>

            <label className={errors.state ? 'required' : ''}>
              {errors.required ? `State ${errors.state}` : 'State'}
              <input
                className="stateInput"
                value={state}
                onChange={(e) => setState(e.target.value)}
              ></input>
            </label>
          </div>

          <div className="latLngInputs">
            <label>
              Latitude
              <input
                className="latInput"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              ></input>
            </label>

            <label>
              Longitude
              <input
                className="lngInput"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              ></input>
            </label>
          </div>

          <hr width='100%' className="newSpotHr" />

          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <label className={errors.description ? 'required' : ''}>
            {errors.description ? `Description ${errors.description}` : ''}
            <textarea
              className="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          <hr width='100%' className="newSpotHr" />

          <h3>Create a title for your spot</h3>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <label className={errors.title ? 'required' : ''}>
            {errors.title ? `Title ${errors.title}` : ''}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </label>

          <hr width='100%' className="newSpotHr" />

          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label className={errors.price ? 'required' : ''}>
            {errors.price ? `Price ${errors.price}` : ''}
            <div className="priceDiv">
              $
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
          </label>

          <hr width='100%' className="newSpotHr" />

          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {errors.imgUrl1 ?
            <div className={errors.imgUrl1 ? 'required' : ''}>
              {`Preview image ${errors.imgUrl1}`}
            </div>
            : ''
          }
          <label>
            <input
              className="imgInput"
              value={imgUrl1}
              onChange={(e) => setImgUrl1(e.target.value)}
            ></input>
          </label>

          <label>
            <input
              className="imgInput"
              value={imgUrl2}
              onChange={(e) => setImgUrl2(e.target.value)}
              disabled={imgUrl1 ? false : true}
            ></input>
          </label>

          <label>
            <input
              className="imgInput"
              value={imgUrl3}
              onChange={(e) => setImgUrl3(e.target.value)}
              disabled={imgUrl2 ? false : true}
            ></input>
          </label>

          <label>
            <input
              className="imgInput"
              value={imgUrl4}
              onChange={(e) => setImgUrl4(e.target.value)}
              disabled={imgUrl3 ? false : true}
            ></input>
          </label>

          <label>
            <input
              className="imgInput"
              value={imgUrl5}
              onChange={(e) => setImgUrl5(e.target.value)}
              disabled={imgUrl4 ? false : true}
            ></input>
          </label>

          <hr width='100%' className="newSpotHr" />

          <div className="createSpotDiv">
            <button
              className="createSpotBtn"
              type="submit"
              onClick={validate}
            >Update Spot
            </button>
          </div>

        </form>
      }
    </>
  )
}
