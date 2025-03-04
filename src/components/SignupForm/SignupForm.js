import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import Loader from '../../components/Loader/Loader';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from 'firebase/app';

import './SignupForm.css';
import userService from '../../services/userService';
import StorageService from '../../services/storageService';

function SignupForm() {
  const [signupData, setSignupData] = useState({ nickname: "", password: "", passwordConfirm: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageNickname, setErrorMessageNickname] = useState(null);
  const [errorPassword, setErrorPassword] = useState({
    error: false,
    eleven: null,
    lower: null,
    upper: null,
    special: null
  });
  const [errorMessagePasswordConfirm, setErrorMessagePasswordConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [iconPassword, setIconPassword] = useState({ password: false, confirm: false });
  const [showPasswordInfos, setShowPasswordInfos] = useState(false);

  const signup = async e => {
    e.preventDefault();
    const storage = new StorageService();
    const auth = getAuth();
    const { nickname, password, passwordConfirm } = signupData;
    let hasError = false;
    try {
      // Valid pseudo
      if (!nickname) {
        setErrorMessageNickname('Choisir un pseudo.');
        hasError = true;
      } else if (!nickname.match(/^[a-zA-Z0-9]{1,20}$/)) {
        hasError = true;
        setErrorMessageNickname('Le pseudo doit avoir une longueur de 20 caractères maximum et ne peut contenir que des majuscules, minuscules ou des chiffres mais pas de caractères spéciaux.');
      } else {
        setErrorMessageNickname(null);
      }

      // Valid password
      if (!password) {
        setErrorPassword({ error: true, eleven: true, lower: true, upper: true, special: true });
        setShowPasswordInfos(true);
        hasError = true;
      } else {
        const newValue = {};
        newValue.eleven = password.length < 11 ? true : false;
        newValue.lower = password.match(/(?=.*[a-z])/) ? false : true;
        newValue.upper = password.match(/(?=.*[A-Z])/) ? false : true;
        newValue.special = password.match(/(?=.*\W)/) ? false : true;
        newValue.error = newValue.six || newValue.lower || newValue.upper || newValue.special
        if(Object.values(newValue).includes(true)) {
          setShowPasswordInfos(true);
          hasError = true;
        }
        setErrorPassword(newValue);
      }

      // Valid confirm password
      if (password !== passwordConfirm) {
        setErrorMessagePasswordConfirm('Les mots de passe doivent être identiques');
        hasError = true;
      } else {
        setErrorMessagePasswordConfirm(null);
      }

      if (hasError) return;
      setIsLoading(true);
      /*
        /!\ Save the pseudo before using 'createUserWithEmailAndPassword'
        because subscriber 'onAuthStateChanged' will be launched immediately after registration
        cela permettra de récupérer le pseudo que n'est pas encore mis à jour grâce à 'updateProfile'
        in order to recover the pseudo which is not yet updated using 'updateProfile'
      */

      const userCredential = await createUserWithEmailAndPassword(auth, nickname + "@romaintix2404.com", password);
      console.log(userCredential);
      if (userCredential.error) {
        throw new FirebaseError({ code: 'auth/email-already-in-use' })
      }
      const { uid } = userCredential.user;
      storage.setData('uid', uid);
      storage.setData('nickname', nickname);
      storage.setData('wordIndex', 0);

      await updateProfile(auth.currentUser, {
        displayName: nickname,
      });

      const result = await userService.create(uid, nickname);

      if (result.error) throw new Error(result.error);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (e) {
      console.log(e);
      if ('auth/email-already-in-use' === e.code) {
        setErrorMessageNickname('Ce pseudo est déjà pris. Il faut en choisir un autre.');
      } else {
        setErrorMessage('Oups... un problème a eu lieu. Il va falloir réessayer !');
      }
      setIsLoading(false);
    }
  };

  const signupFormChangeHAndler = e => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  return (
    <div className="SignupForm">
      {isLoading && <Loader />}
      <h1>Je crée mon compte</h1>

      {errorMessage && <div className='alert-danger'>{errorMessage}</div>}

      <form onSubmit={signup}>
        <div className={`formField${errorMessageNickname ? ' error' : ''}`}>
          <input
            value={signupData.nickname}
            onChange={signupFormChangeHAndler}
            type="text"
            name="nickname"
            autoComplete="username"
            placeholder="Pseudo"
            id="nickname-signup-input" />
          {errorMessageNickname && <p className='error-message-nickname'>{errorMessageNickname}</p>}
        </div>

        <div className={`formField${errorPassword.error ? ' error' : ''}`}>
          <input
            value={signupData.password} onChange={signupFormChangeHAndler}
            type={iconPassword.password ? 'text' : 'password'}
            autoComplete="new-password"
            name="password"
            placeholder="Mot de passe"
            id="password-signup-input" />
          <FontAwesomeIcon
            className='eye-icon-show-hide-password'
            icon={iconPassword.password ? faEyeSlash : faEye}
            onClick={() => setIconPassword((i) => { return { ...i, password: !i.password } })}
          />
           <FontAwesomeIcon
            className='show-hide-password-infos'
            icon={faInfoCircle}
            onClick={() => {setShowPasswordInfos((i) => !i);}}
          />
        </div>
       
        {showPasswordInfos && (
          <div className="password-infos">
            <p>Le mot de passe doit contenir :</p>
            <ul className='first-child'>
              <li className={errorPassword.error && errorPassword.eleven ? 'error' : errorPassword.eleven !== null ? 'success' : ''}>11 caractères</li>
              <li className={errorPassword.error && errorPassword.lower ? 'error' : errorPassword.lower !== null ? 'success' : ''}>1 lettre minuscule</li>
              <li className={errorPassword.error && errorPassword.upper ? 'error' : errorPassword.upper !== null ? 'success' : ''}>1 lettre majuscule</li>
              <li className={errorPassword.error && errorPassword.special ? 'error' : errorPassword.special !== null ? 'success' : ''}>1 caractère particulier</li>
            </ul>
          </div>
        )}



        <div className={`formField${errorMessagePasswordConfirm ? ' error' : ''}`}>
          <input
            value={signupData.passwordConfirm} onChange={signupFormChangeHAndler}
            type={iconPassword.confirm ? 'text' : 'password'}
            autoComplete="new-password"
            name="passwordConfirm"
            placeholder="Mot de passe (confirmation)"
            id="password-confirm-signup-input" />
          {errorMessagePasswordConfirm && <p>{errorMessagePasswordConfirm}</p>}
          <FontAwesomeIcon
            className='eye-icon-show-hide-password'
            icon={iconPassword.password ? faEyeSlash : faEye}
            onClick={() => setIconPassword((i) => { return { ...i, confirm: !i.confirm } })}
          />

        </div>
        <input type="submit" value="Envoyer" />
      </form>
    </div>
  );
}

export default SignupForm;
