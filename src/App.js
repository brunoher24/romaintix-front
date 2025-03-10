import { useState, useEffect/*, useRef */} from "react";
//redux
import { useDispatch, useSelector } from 'react-redux';
import { selectPopup } from "./features/popupSlice";
import { resetUserInfos, setLoggedInInfos } from "./features/userSlice";
import { selectGame } from "./features/gameSlice";
// firebase
import { getAuth, onAuthStateChanged/*, connectAuthEmulator */ } from "firebase/auth";
// import { doc, onSnapshot } from "firebase/firestore";
// services
import StorageService from "./services/storageService";
import userService from "./services/userService";
//hooks
import useElementOnScreen from "./hooks/intersectionObserverApi";
// components
import LoginForm from "./components/LoginForm/LoginForm";
import SignupForm from "./components/SignupForm/SignupForm";
import HeaderInfos from "./components/HeaderInfos/HeaderInfos";
import Popup from "./components/Popup/Popup";
import InfosSection from "./components/InfosSection/InfosSection";
import CongratsSection from "./components/CongratsSection/CongratsSection";
import PlaySection from "./components/PlaySection/PlaySection";
// style
import './App.css';

function App() {
  const [formThatShouldBeDisplayed, setFormThatShouldBeDisplayed] = useState("login");
  
  const popup = useSelector(selectPopup);
  const { wordHasBeenFound } = useSelector(selectGame);

  const dispatch = useDispatch();


  const auth = getAuth();

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  });

  useEffect(() => {
    const onAuthStateChange = () => {

      // 4 cas :
      // *** l'utilisateur se connecte
      // *** l'utilsiateur se déconnecte
      // *** l'utilisateur arrive sur le site déjà connecté
      // *** l'utilisateur arrive sur le site déjà déconnecté
      return onAuthStateChanged(auth, async user => {
        const storage = new StorageService();
        // si l'utilisateur se connecte ou arrive sur le site déjà connecté
        if (user) {
          setFormThatShouldBeDisplayed("logout");
          const { uid, email, accessToken } = user;
          const nickname = email.split("@")[0];
          let wordIndex = storage.getData("wordIndex");
          // si l'utilisateur vient de se connecter, et qu'il n'y a rien dans le localStorage 
          if (wordIndex === -1) {
            const userInfos = await userService.readOne(uid);
            wordIndex = userInfos.wordIndex;
            storage.setData('uid', uid);
            storage.setData('nickname', nickname);
            storage.setData('wordIndex', wordIndex);
            storage.setData('firebaseIdToken', accessToken);
          }

          dispatch(setLoggedInInfos({ uid, nickname, wordIndex, firebaseIdToken: accessToken}));
          // emulateGame();
          // emulateGame();
          // *** c'est le cas où l'utilisateur se déconnecte OU recharge le site en étant déjà déconnecté
        } else {
          dispatch(resetUserInfos());
          storage.clear();
          setFormThatShouldBeDisplayed("login"); //
        }
      });
    };

    const unsubscribe = onAuthStateChange();
    return () => {
      unsubscribe();
    };

  }, [auth, dispatch]);

  const showLoginSignupForm = () => {
    setFormThatShouldBeDisplayed(f => f === "login" ? "signup" : "login");
  };

  

  return (
    <div className="App">
      {popup.show && <Popup />}

      <HeaderInfos />

      <section className="login-signup-infos-section">
        {
          formThatShouldBeDisplayed === "login" && (
            <div>
              <LoginForm />
              <button className="switch-form-btn" onClick={showLoginSignupForm}>Je m'inscris</button>
            </div>
          )
        }
        {
          formThatShouldBeDisplayed === "signup" && (
            <div ref={containerRef}>
              {isVisible && <>
                <SignupForm />
                <button className="switch-form-btn" onClick={showLoginSignupForm}>Je me connecte</button>
              </>}

            </div>
          )
        }
        {
          formThatShouldBeDisplayed === "logout" && (
            <InfosSection/>
          )
        }
      </section>
      {
        formThatShouldBeDisplayed === "logout" && (
          <article className="main-content">
            {wordHasBeenFound && (
              <CongratsSection/>
            )}
            <PlaySection/>       
          </article>
        )
      }
      <div className="online-web-fonts-credits">Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed by CC BY 4.0</div>
    </div>
  );
}

export default App;
