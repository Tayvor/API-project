import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";

import * as sessionActions from "../../store/session";

import './LoginForm.css'


export default function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.loginUser({ credential, password }))
      .then(closeModal)
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json();
        setErrors({ ...data })

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1 className="login">Log In:</h1>
      <form onSubmit={handleSubmit} className="loginForm">
        <label>Credential:
          <input
            type="text"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            required
          >
          </input>
        </label>
        <label>Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          >
          </input>
        </label>
        {errors && <p>{errors.message}</p>}
        <button
          disabled={!credential || !password ? true : false}
          className="loginBtn"
        >
          Submit
        </button>
      </form>
    </>
  )
}
