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
import ProgressBar from "./components/ProgressBar/ProgressBar";

function App() {
  const [playedWords, setPlayedWords] = useState([]);
  const [lastPlayedWord, setLastPlayedWord] = useState({ value: "", score: 0, number: 0, percents: 0 });
  const [wordBeeingPlayed, setWordBeeingPlayed] = useState("");
  const [formThatShouldBeDisplayed, setFormThatShouldBeDisplayed] = useState("login");
  const [playedWordRewardIndex, setPlayedWordRewardIndex] = useState(-1);
  const [errorMessageInvalidWord, setErrorMessageInvalidWord] = useState("");

  const dispatch = useDispatch();
  const auth = getAuth();

  const storage = useMemo(() => new StorageService(), []);

  const popup = useSelector(selectPopup);
  const { wordIndex } = useSelector(selectUser);

  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  });

  const emojis = ["🥳", "😱", "🔥", "🥵", "😎", "🥶"];

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
          let { wordIndex } = storage.getAllData();
          // si l'utilisateur vient de se connecter, et qu'il n'y a rien dans le localStorage 
          if (wordIndex === -1) {
            const userInfos = await userService.readOne(uid);
            wordIndex = userInfos.wordIndex;
            storage.setAllData({ uid, nickname, wordIndex });
          }

          dispatch(setLoggedInInfos({ uid, nickname, wordIndex }));

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

  }, [auth, dispatch, storage]);

  const play = async e => {
    e.preventDefault();
    const index = playedWords.findIndex(w => w.value === wordBeeingPlayed);
    if (index > -1) {
      setLastPlayedWord(playedWords[index]);
    } else if (!dico.includes(wordBeeingPlayed)) {
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
      playedWords_.sort((a, b) => b.degrees - a.degrees);
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

  const setCorrectEmojiToTemperature = (temperature) => {
    if (temperature < 0) return emojis[5]
    if (temperature < 25) return emojis[4]
    if (temperature < 36) return emojis[3]
    if (temperature < 49) return emojis[2]
    if (temperature < 64.3) return emojis[1]
    return emojis[0];
  }

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
            <div className="infos-section">
              <h1>Mot à trouver n° {wordIndex + 1} / 5</h1>

              <table className="story">
                <thead>
                  <tr><th className="number-top"><b>‰</b></th><th className="emoji-top">🌡</th><th className="number-top"><b>°C</b></th></tr>
                </thead>
                <tbody><tr><td className="number-top">1000</td><td className="emoji">🥳</td><td className="number-top">100.00</td></tr>
                  <tr><td className="number-top">999</td><td className="emoji-top">😱</td><td className="number-top">64.29</td></tr>
                  <tr><td className="number-top">990</td><td className="emoji-top">🔥</td><td className="number-top">48.99</td></tr>
                  <tr><td className="number-top">900</td><td className="emoji-top">🥵</td><td className="number-top">35.99</td></tr>
                  <tr><td className="number-top">1</td><td className="emoji-top">😎</td><td className="number-top">24.99</td></tr>
                  <tr><td className="number-top"></td><td className="emoji-top">🥶</td><td className="number-top">-0.01</td></tr>
                </tbody></table>
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
                    <th className="number order" id="chronoOrder">Nº</th>
                    <th className="word">Mot</th>
                    <th className="number order" id="temperatureOrder">°C</th>
                    <th className="emoji">🌡</th>
                    <th className="number">‰</th>
                    <th className="progress">Progression</th>
                  </tr>
                  {(lastPlayedWord.number > 0 && playedWords.length > 1) && (
                    <tr className={lastPlayedWord.percents > 0 ? "bolder" : "guesses"}>
                      <td className="align-right">{lastPlayedWord.number}</td>
                      <td className="word">{lastPlayedWord.value}</td>
                      <td className="align-right">{lastPlayedWord.degrees}</td>
                      <td className="emoji-td">{setCorrectEmojiToTemperature(lastPlayedWord.degrees)}</td>
                      {lastPlayedWord.percents > 0 && (
                        <td className="align-right">{lastPlayedWord.percents}</td>
                      )}
                      {lastPlayedWord.percents > 0 && (
                        <td><ProgressBar animated={true} percents={lastPlayedWord.percents} /></td>
                      )}
                    </tr>
                  )}
                  <tr><td style={{ color: "#00000000" }}>_</td></tr>
                </thead>
                <tbody>

                  {playedWords.map((word, index) => (
                    <tr key={index} className={word.percents > 0 ? "bolder" : "guesses"}>
                      <td className="align-right">{word.number}</td>
                      <td className="word">{word.value}</td>
                      <td className="align-right">{word.degrees}</td>
                      <td className="emoji-td">{setCorrectEmojiToTemperature(word.degrees)}</td>
                      {word.percents > 0 && (
                        <td className="align-right">{word.percents}</td>
                      )}
                      {word.percents > 0 && (
                        <td><ProgressBar animated={word.number === lastPlayedWord.number} percents={word.percents} /></td>
                      )}
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
