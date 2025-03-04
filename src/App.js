import { useState, useEffect, useMemo } from "react";

import './App.css';
import { getAuth, onAuthStateChanged/*, connectAuthEmulator */ } from "firebase/auth";
// import { doc, onSnapshot } from "firebase/firestore";
import { /*db,*/ functions } from './services/firebaseInit';

import { httpsCallable } from "firebase/functions";
import { useDispatch, useSelector } from 'react-redux';
import { resetUserInfos, selectUser, setLoggedInInfos } from "./features/userSlice";
import StorageService from "./services/storageService";
import LoginForm from "./components/LoginForm/LoginForm";
import SignupForm from "./components/SignupForm/SignupForm";
import useElementOnScreen from "./hooks/intersectionObserverApi";
import HeaderInfos from "./components/HeaderInfos/HeaderInfos";
import { selectPopup } from "./features/popupSlice";
import Popup from "./components/Popup/Popup";
import userService from "./services/userService";
import dico from "./assets/dico.json";
import degreesPercents from "./assets/degreesPercents.json";

function App() {
  const [playedWords, setPlayedWords] = useState([]);
  const [lastPlayedWord, setLastPlayedWord] = useState({ value: "", score: 0, number: 0, percents: 0 });
  const [wordBeeingPlayed, setWordBeeingPlayed] = useState("");
  const [formThatShouldBeDisplayed, setFormThatShouldBeDisplayed] = useState("login");
  const [playedWordRewardIndex, setPlayedWordRewardIndex] = useState(-1);
  const [errorMessageInvalidWord, setErrorMessageInvalidWord] = useState("");

  const dispatch = useDispatch();
  const auth = getAuth();

  const { getAllData, setAllData, clear } = useMemo(() => new StorageService(), []);

  const popup = useSelector(selectPopup);
  const { wordIndex } = useSelector(selectUser);

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
        // si l'utilisateur se connecte ou arrive sur le site déjà connecté
        if (user) {
          setFormThatShouldBeDisplayed("logout");
          const { uid, email } = user;
          const nickname = email.split("@")[0];
          let { wordIndex } = getAllData();
          // si l'utilisateur vient de se connecter, et qu'il n'y a rien dans le localStorage 
          if (wordIndex === -1) {
            const userInfos = await userService.readOne(uid);
            wordIndex = userInfos.wordIndex;
            setAllData({ uid, nickname, wordIndex });
          }

          dispatch(setLoggedInInfos({ uid, nickname, wordIndex }));

          // *** c'est le cas où l'utilisateur se déconnecte OU recharge le site en étant déjà déconnecté
        } else {
          dispatch(resetUserInfos());
          clear();
          setFormThatShouldBeDisplayed("login"); //
        }
      });
    };

    const unsubscribe = onAuthStateChange();
    return () => {
      unsubscribe();
    };

  }, [auth, dispatch, setAllData, getAllData, clear]);

  const play = async e => {
    e.preventDefault();
    const index = playedWords.findIndex(w => w.value === wordBeeingPlayed);
    if (index > -1) {
      setLastPlayedWord(playedWords[index]);
    } else if (!dico.includes(wordBeeingPlayed)) {
      console.log("Invalid");
      setErrorMessageInvalidWord("Essaye avec des vrais mots, c'est plus drôle.")
    }
    else {
      setErrorMessageInvalidWord("");

      const score = Math.round(Math.random() * 12430 - 6000) / 100;
      const percents = score < 25 ? 0 : degreesPercents.find(dp => dp.d === score).p
      const newWord = {
        value: wordBeeingPlayed,
        degrees: score,
        percents: percents,
        number: playedWords.length + 1
      };
      const playedWords_ = [...playedWords, newWord];
      playedWords_.sort((a, b) => a.degrees - b.degrees);
      setPlayedWords(playedWords_);
      setLastPlayedWord(newWord);

      // TODO
      // try {
      //   const getWordScore = httpsCallable(functions, 'getWordScore');
      //   const result = await getWordScore({ wordIndex, wordBeeingPlayed })
      //   const data = result.data;
      //   console.log(data);

      // } catch (err) {
      //   console.log("Une erreur est survenue !", err);
      // }
    }
  };

  const playFormChangeHAndler = e => {
    setWordBeeingPlayed(e.target.value);
  };

  const wordReward = e => {
    if (e.code === "ArrowUp" || e.key === "ArrowUp" || e.keyCode === 38) {
      if (playedWords.length > 0) {
        if (playedWordRewardIndex === 0) {
          setPlayedWordRewardIndex(playedWords.length - 1);
        } else if (playedWordRewardIndex > 0) {
          setPlayedWordRewardIndex(i => i - 1);
        } else if (playedWordRewardIndex === -1) {
          setPlayedWordRewardIndex(playedWords.length - 1);
        }
        setWordBeeingPlayed(playedWords[playedWordRewardIndex].value);
      }
    } else if (e.code === "ArrowDown" || e.key === "ArrowDown" || e.keyCode === 40) {
      if (playedWords.length > 0) {
        if (playedWordRewardIndex === -1) {
          setPlayedWordRewardIndex(0);
        } else if (playedWordRewardIndex < playedWords.length - 1) {
          setPlayedWordRewardIndex(i => i + 1);
        } else if (playedWordRewardIndex === playedWords.length - 1) {
          setPlayedWordRewardIndex(0);
        }
        setWordBeeingPlayed(playedWords[playedWordRewardIndex].value);
      }
    }
  };

  const showLoginSignupForm = () => {
    setFormThatShouldBeDisplayed(f => f === "login" ? "signup" : "login");
  }

  return (
    <div className="App">
      {popup.show && <Popup />}

      <HeaderInfos />

      <section className="login-signup-logout-section">
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
      </section>



      {
        formThatShouldBeDisplayed === "logout" && (
          <article className="main-content">
            <section className="play-section">
              <form onSubmit={play}>
                <input type="text" name="word" id="word-input" value={wordBeeingPlayed} onChange={playFormChangeHAndler} onKeyUp={wordReward} />
                <input id="play-form-submit-input" type="submit" value="Envoyer" />
                <p className="error-message-invalid-word">{errorMessageInvalidWord}</p>
              </form>
            </section>

            <section className="words-played-section">
              <table className="guess-table">
                <thead>
                  <tr>
                    <th class="number order" id="chronoOrder">Nº</th>
                    <th class="number order" id="temperatureOrder">°C</th>
                    <th class="emoji">🌡</th>
                    <th class="number">‰</th>
                    <th class="progress">Progression</th>
                  </tr>
                  {lastPlayedWord.number > 0 && (
                    <tr id="guessed" class="guesses">
                      <td>{playedWords.length + 1}</td>
                      <td>{lastPlayedWord.value}</td>
                      <td>{lastPlayedWord.degrees}</td>
                      <td>{lastPlayedWord.percents}</td>
                      <td></td>
                    </tr>
                  )}
                 
                </thead>
                <tbody>
                  {playedWords.map((word, index) => (
                    <tr key={index}>
                      <td>{word.number}</td>
                      <td>{word.value}</td>
                      <td>{word.degrees}</td>
                      <td>{word.percents}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </article>
        )
      }


      <div className="online-web-fonts-credits">Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed by CC BY 4.0</div>
    </div>
  );
}

export default App;
