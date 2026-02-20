import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Loader from '../Loader/Loader';

import './LoginForm.css';

function LoginForm() {
  const [loginData, setLoginData] = useState({ nickname: "", password: "" });
  const [errorLogin, setErrorLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);


  const login = e => {
    e.preventDefault();
    setIsLoading(true);

    const auth = getAuth();
    const { nickname, password } = loginData;
    signInWithEmailAndPassword(auth, nickname+"@romaintix2404.com", password)
    .then(() => {
      setTimeout(() => {
        // navigate("/");
        setIsLoading(false);
      }, 2000);
    })
    .catch(error => {
      // setFailedLoginAttempts((f) => f + 1);
      console.log(error);
      setIsLoading(false);
      setErrorLogin(true);
    });

  }

  const loginFormChangeHAndler = e => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };


  return (
    <div className='LoginForm'>
      { isLoading && <Loader/> }
      <h2>Je me connecte</h2>
      {errorLogin && <div className="alert-danger">Pseudo ou mot de passe incorrect.</div>}

      <form onSubmit={login}>
      <input
        value={loginData.nickname}
        onChange={loginFormChangeHAndler}
        type="text"
        name="nickname"
        placeholder="Nom d'utilisateur"
        autoComplete="username"
        id="nickname-login-input" />
      <input
        value={loginData.password} onChange={loginFormChangeHAndler}
        type="password"
        autoComplete="new-password"
        placeholder="Mot de passe"
        name="password"
        id="password-login-input" />
        <input type="submit" value="Envoyer" />

    </form>
    </div>
    
  );
}

export default LoginForm;
