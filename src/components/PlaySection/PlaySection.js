// react
import { useState } from 'react';
// firebase

// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectGame, updatePlayedWords, updateWordHasBeenFound } from '../../features/gameSlice';
import { selectUser } from '../../features/userSlice';
//services
import { setCorrectEmojiToTemperature } from '../../services/utilities';
// components
import ProgressBar from "../ProgressBar/ProgressBar";
// assets
import dico from "../../assets/dico.json";
import degreesPercents from "../../assets/degreesPercents.json";
// style
import './PlaySection.css';

function PlaySection() {

    const [lastPlayedWord, setLastPlayedWord] = useState({ value: "", score: 0, number: 0, percents: 0, emoji: "" });
    const [wordBeeingPlayed, setWordBeeingPlayed] = useState("");
    const [playedWordRewardIndex, setPlayedWordRewardIndex] = useState(-1);
    const [errorMessageInvalidWord, setErrorMessageInvalidWord] = useState("");

    const { playedWords } = useSelector(selectGame);
    const { wordIndex } = useSelector(selectUser)
    const dispatch = useDispatch();

    // TEST
    // const INITIAL_TIMER = 200;
    // const TARGET_TIMER = 0;
    // const [timer, setTimer] = useState(INITIAL_TIMER);
    // useEffect(() => {
    //   if (timer > TARGET_TIMER) {
    //     setTimeout(() => {
    //       const playedWords_ = play(dico[timer]);
    //       setPlayedWords(playedWords_);
    //       setTimer(timer - 1);
    //     }, 40);  
    //   } else {
    //     setWordHasBeenFound(true);
    //   }
    // }, [timer]);
    // TEST

    const submitPlayForm = async e => {
        e.preventDefault();
        const [playedWords_, lastPlayedWord_] = await play(wordBeeingPlayed);
        if (playedWords_ && playedWords_.length) {
            const delay = lastPlayedWord_.percents > 0 ? 3000 : 0;
            window.setTimeout(() => {
                dispatch(updatePlayedWords(playedWords_));
            }, delay);
        }
    }

    const play = async (wordBeeingPlayed_) => {
        const index = playedWords.findIndex(w => w.value === wordBeeingPlayed_);
        if (index > -1) {
            setLastPlayedWord(playedWords[index]);
        } else if (!dico.includes(wordBeeingPlayed_)) {
            setErrorMessageInvalidWord("Essaye avec des vrais mots, c'est plus drôle.")
        }
        else {
            setErrorMessageInvalidWord("");
            // TEST
            // const score = Math.round(Math.random() * 12430 - 6000) / 100;
            // TEST

            // TODO
            try {
                // const getWordScore = httpsCallable(functions, 'getWordScore');
                // const result = await getWordScore({ wordIndex, wordBeeingPlayed })
                const score = 12;
                console.log(score);
                // TODO si mot trouvé, dispatch(updateWordHasBeenFound(true))
                const percents = score < 25 ? 0 : degreesPercents.find(dp => dp.d === score).p;
                const newWord = {
                    value: wordBeeingPlayed_,
                    degrees: score,
                    percents: percents,
                    number: playedWords.length + 1,
                    emoji: setCorrectEmojiToTemperature(score)
                };
                const playedWords_ = [...playedWords, newWord];
                playedWords_.sort((a, b) => b.degrees - a.degrees);
                setLastPlayedWord(newWord);
                return [playedWords_, newWord];
            } catch (err) {
            console.log("Une erreur est survenue !", err);
            }
        }
        return [];
    };

    const playFormChangeHAndler = e => {
        setWordBeeingPlayed(e.target.value);
    };

    const getWordsHistoric = e => {
        if (e.code === "ArrowUp" || e.key === "ArrowUp" || e.keyCode === 38) {
            if (playedWords.length > 0) {
                let playedWordRewardIndex_ = playedWordRewardIndex;
                if (playedWordRewardIndex <= 0) {
                    playedWordRewardIndex_ = playedWords.length - 1;
                } else {
                    playedWordRewardIndex_ --;
                }
                setPlayedWordRewardIndex(playedWordRewardIndex_);
                setWordBeeingPlayed(playedWords[playedWordRewardIndex_].value);
            }
        } else if (e.code === "ArrowDown" || e.key === "ArrowDown" || e.keyCode === 40) {
            if (playedWords.length > 0) {
                let playedWordRewardIndex_ = playedWordRewardIndex;
                if (playedWordRewardIndex === -1 || playedWordRewardIndex === playedWords.length - 1) {
                   playedWordRewardIndex_ = 0;
                } else {
                    playedWordRewardIndex_++;
                }
                setPlayedWordRewardIndex(playedWordRewardIndex_);
                setWordBeeingPlayed(playedWords[playedWordRewardIndex_].value);
            }
        }
    };

    return (
        <div className="PlaySection">
            <section className="play-section">
                <form onSubmit={submitPlayForm}>
                    <input type="text" name="word" id="word-input" value={wordBeeingPlayed} onChange={playFormChangeHAndler} onKeyUp={getWordsHistoric} />
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
                        {(lastPlayedWord.number > 0) && (
                            <tr className={lastPlayedWord.percents > 0 ? "bolder" : "guesses"}>
                                <td className="align-right">{lastPlayedWord.number}</td>
                                <td className="word">{lastPlayedWord.value}</td>
                                <td className="align-right">{lastPlayedWord.degrees}</td>
                                <td className="emoji-td">{lastPlayedWord.emoji}</td>
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
                                <td className="emoji-td">{word.emoji}</td>
                                {word.percents > 0 && (
                                    <td className="align-right">{word.percents}</td>
                                )}
                                {word.percents > 0 && (
                                    <td><ProgressBar animated={false} percents={word.percents} /></td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default PlaySection;
