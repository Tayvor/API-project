import { useEffect, useState } from "react";
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
  const [disabled, setDisabled] = useState(true);

  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.loginUser({ credential, password }))
      .then(() => closeModal())
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json();
        setErrors({ ...data })

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = (e) => {
    e.preventDefault();
    const credential = 'demo';
    const password = 'password';

    return dispatch(sessionActions.loginUser({ credential, password }))
      .then(() => closeModal())
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json();
        setErrors({ ...data })

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  useEffect(() => {
    setDisabled(true)
    if (credential.length > 3 &&
      password.length > 5) {
      setDisabled(false)
    }
  }, [credential, password])

  return (
    <>
      <form onSubmit={handleSubmit} className="loginForm">
        <h1 className="login-header">Log In</h1>
        {errors.message && <p className="err">The provided credentials were invalid.</p>}

        <input
          placeholder="Username or Email"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        >
        </input>

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        >
        </input>

        <button
          className={credential.length > 3 && password.length > 5 ? 'loginFormBtn' : 'disabled'}
          disabled={disabled}
        >
          Log In
        </button>
      </form>

      <div className="demoLogin">
        <div
          onClick={demoLogin}
        >Log in as Demo User</div>
      </div>
    </>
  )
}
