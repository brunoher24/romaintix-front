import { useState, useEffect/*, useRef */} from "react";
//redux
import { useDispatch, useSelector } from 'react-redux';
import { selectPopup } from "./features/popupSlice";
import { selectUser, resetUserInfos, setAccessToken, setUserInfos } from "./features/userSlice";
import { selectGame } from "./features/gameSlice";
// firebase
import { getAuth, onAuthStateChanged/*, connectAuthEmulator */ } from "firebase/auth";
import { db } from "./services/firebaseInit";
import { doc, onSnapshot } from "firebase/firestore";
// services
//hooks
import useElementOnScreen from "./hooks/intersectionObserverApi";
// components
import LoginForm from "./components/LoginForm/LoginForm";
import SignupForm from "./components/SignupForm/SignupForm";
import HeaderInfos from "./components/HeaderInfos/HeaderInfos";
import Popup from "./components/Popup/Popup";
import InfosSection from "./components/InfosSection/InfosSection";
import CongratsSection from "./components/CongratsSection/CongratsSection";
import PlayRomaintixSection from "./components/PlayRomaintixSection/PlayRomaintixSection";
import PlayBebouwikixSection from "./components/PlayBebouwikixSection/PlayBebouwikixSection";
// style
import './App.css';
// assets
import cloudIconBebouwikix from "./assets/cloud-icon-bebouwikix.webp";
import cloudIconRomantix from "./assets/cloud-icon-romaintix.webp";

function App() {
  const [formThatShouldBeDisplayed, setFormThatShouldBeDisplayed] = useState("login");
  const popup = useSelector(selectPopup);
  const { wordHasBeenFound } = useSelector(selectGame);
  const { wordIndex } = useSelector(selectUser);

  const [uid, setUid] = useState("");
  

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
        // si l'utilisateur se connecte OU arrive sur le site déjà connecté
        if (user) {
          setFormThatShouldBeDisplayed("logout");
          dispatch(setAccessToken(user.accessToken));
          setUid(user.uid);
          // emulateGame();
          // *** c'est le cas où l'utilisateur se déconnecte OU recharge le site en étant déjà déconnecté
        } else {
          dispatch(resetUserInfos());
          setFormThatShouldBeDisplayed("login");
          setUid("");
        }
      });
    };

    const unsubscribe = onAuthStateChange();
    return () => {
      unsubscribe();
    };

  }, [auth, dispatch]);

  useEffect(() => {
    if(uid) {
      const unsubscribe = onSnapshot(
        doc(db, "users", uid), 
        { includeMetadataChanges: false }, 
        snap => {
          console.log("setUserInfos from cloud firestore");
          const {nickname, previousWord, uid, wordIndex} = snap.data();
          dispatch(setUserInfos({nickname, previousWord, uid, wordIndex}))
        });
      return () => {
        unsubscribe()
      }
    }
    
  }, [uid]);

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
          <div className="flex-ctnr">
            <div className={wordIndex < 5 ? "game-switch first" : "game-switch second"}>
              <img src={cloudIconRomantix} />
              <h2>Découvre les 5 mots secrets !</h2>
            </div>
        
            <div className={wordIndex >= 5 ? "game-switch first" : "game-switch second"}>
              <img src={cloudIconBebouwikix} />
              <h2>Découvre la page Wikipedia !</h2>
            </div>

            <article className="main-content">
            {
            wordHasBeenFound ? (
              <CongratsSection/>
            ) :  wordIndex < 5 ?
              <PlayRomaintixSection/> :
              <PlayBebouwikixSection/>
            }   
            </article>
          </div>
          
        )
      }
      <div className="online-web-fonts-credits">Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed by CC BY 4.0</div>
    </div>
  );
}

export default App;
