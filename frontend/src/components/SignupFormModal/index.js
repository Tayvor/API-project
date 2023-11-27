import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import './SignupForm.css'

export default function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  const { closeModal } = useModal();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signupUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
            console.log(data, '<== Data ===')
          }
        });
    }
    return setErrors({
      confirmPassword: "Passwords do not match!"
    });
  };

  useEffect(() => {
    setDisabled(true)
    if (email && username && username.length > 3 &&
      firstName && lastName &&
      password && password.length > 5 &&
      confirmPassword && confirmPassword.length > 5) {
      setDisabled(false)
    }
  }, [email, username, firstName, lastName, password, confirmPassword]);

  return (
    <>
      <h1 className="signupHeader">Signup</h1>
      <form onSubmit={handleSignup} className="signupForm">

        <label>
          Email:
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          ></input>
        </label>
        {errors.email && <p className="err">{errors.email}</p>}

        <label>
          Username:
          <input
            placeholder="Enter at least 4 characters."
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          ></input>
        </label>
        {errors.username && <p className="err">{errors.username}</p>}

        <label>
          First Name:
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
          ></input>
        </label>
        {errors.firstName && <p className="err">{errors.firstName}</p>}

        <label>
          Last Name:
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            required
          ></input>
        </label>
        {errors.lastName && <p className="err">{errors.lastName}</p>}

        <label>
          Password:
          <input
            placeholder="Enter at least 6 characters."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          ></input>
        </label>
        {errors.password && <p className="err">{errors.password}</p>}

        <label>
          Confirm Password:
          <input
            placeholder="Enter at least 6 characters."
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          ></input>
        </label>
        {errors.confirmPassword && <p className="err">{errors.confirmPassword}</p>}

        <button
          className={disabled ? 'disabled' : 'signupFormBtn'}
          disabled={disabled}
          type="submit"
        >Sign Up!</button>
      </form>
    </>
  )
}
