// react
import { useEffect, useRef, useState } from 'react';
import userService from '../../services/userService';
import { textFormater } from '../../services/utilities';
// firebase

// redux
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { updatePlayedWordsWiki, selectGame, updateFoundWordsWiki } from '../../features/gameSlice';
import { selectPopup, show } from '../../features/popupSlice';

// import { selectGame, updatePlayedWords, updateWordHasBeenFound } from '../../features/gameSlice';
// import { selectUser } from '../../features/userSlice';
// //services
// import userService from '../../services/userService';

// components
import Popup from '../Popup/Popup';
// assets
//import dico from "../../assets/dico.json";
// style
import './PlayBebouwikixSection.css';

import greenSquare from '../../assets/square-icons/carre-vert.png';
import redSquare from '../../assets/square-icons/carre-rouge.png';
// import orangeSquare from '../../assets/square-icons/carre-orange.png';
import yellowSquare from '../../assets/square-icons/carre-jaune.png';


const ORIGINAL_STR = `
-----h2 Ihlas Bebou 
-----p Ihlas Bebou , né le 23 avril 1994 à Sokodé , est un footballeur international togolais . Pouvant évoluer au poste de milieu offensif ou d ' attaquant , il joue pour le 1899 Hoffenheim , en Bundesliga .
-----h3 Biographie 
-----h4 En club 
-----p Le 16 mai 2019 , Hanovre ayant officiellement été relégué en 2 . Bundesliga , il signe pour quatre saisons avec le TSG Hoffenheim . Le montant de la transaction s ' élève à 10 millions d ' euros . 
-----h4 En équipe nationale 
-----p Il reçoit sa première sélection en équipe du Togo le 4 septembre 2016 , contre Djibouti .  Ce match remporté sur le large score de 5 - 0 rentre dans le cadre des éliminatoires de la Coupe d ' Afrique des nations 2017 . 
-----h3 Palmarès 
-----h4 Fortuna Dusseldorf 
-----p Bundesliga : Champion : 2018`
    .replace(/ +/g, " ")
    .replace(/\n/g, "")
    .trim();

function PlayBebouwikixSection() {
    const [wordBeeingPlayed, setWordBeeingPlayed] = useState("");
    const [errorMessageInvalidWord, setErrorMessageInvalidWord] = useState("");
    const [rendered, setRendered] = useState([]);
    const [wordMatches, setWordMatches] = useState({exact:0, low:0, high:0, none: false});
    const {playedWordsWiki} = useSelector(selectGame);
    const wordsToFind = useRef({});

    const { accessToken } = useSelector(selectUser);
    const {foundWordsWiki} = useSelector(selectGame);
    const popup = useSelector(selectPopup);
    const dispatch = useDispatch();

    useEffect(() => {
        if(Object.keys(foundWordsWiki).length === 0) {
            const foundWords_ = {};
            const rendered_ = ORIGINAL_STR
                .replace(/-+[a-z]+[1–9]*/g, '')
                .split(/\s+/);
            rendered_.forEach(word => {
                const formated = textFormater(word);
                if(foundWords_[formated]) {
                    foundWords_[formated].occurences ++;
                } else {
                    if ([",", "\"", "'", "(", ")", ":", ";", "-", "."].includes(word)) {
                        foundWords_[word] = { similarity: 1, unformated: word, occurences: 1 };
                    } else {
                        foundWords_[formated] = { similarity: 0, unformated: word, occurences: 1 };
                        wordsToFind.current[formated] = { similarity: 0, unformated: word };
                    }            
                } 
            });
            dispatch(updateFoundWordsWiki(foundWords_));
        } else if(Object.keys(wordsToFind.current).length === 0) {
            for(const key in foundWordsWiki) {
                const word = foundWordsWiki[key];
                if(word.similarity < 0.9) {
                    wordsToFind.current[key] = { similarity: word.similarity, unformated: word.unformated };
                }
            }
        }
    }, [foundWordsWiki, dispatch]);

    useEffect(() => {
        const renderTxt = () => {
            const wordBeeingPlayedFormated = textFormater(wordBeeingPlayed);
            let str = ORIGINAL_STR;
            const strParts = str.split("-----").slice(1).map(txt => txt.split(" "));
            const renderTxtArr = (txtArr, index) => {
                const txtParts = txtArr.slice(1).map(word => textFormater(word)).map((word, i) => (
                    <span key={index + i}>
                        {!foundWordsWiki[word] ? 
                        word : 
                        foundWordsWiki[word]?.similarity > 0.9 ? 
                            <span 
                            style={{ marginTop: word === "'" && "-15px", backgroundColor: word === wordBeeingPlayedFormated ? "var(--success-bg)" : "transparent", padding: "2px" }}>
                                {foundWordsWiki[word].unformated}
                            </span> : 
                            <span 
                            className="word-not-found" 
                            style={{ 
                                width: foundWordsWiki[word].closest ? foundWordsWiki[word].closest.length * 14 + "px" : word.length * 14 + "px", 
                                color: 
                                foundWordsWiki[word]?.similarity > 0.45 
                                ? foundWordsWiki[word].closest === wordBeeingPlayedFormated ? 
                                     "#ff0000" : "var(--dark-grey-text)" : 
                                     foundWordsWiki[word]?.similarity > 0.35 ? 
                                     foundWordsWiki[word].closest === wordBeeingPlayedFormated ? 
                                        "#ffa500" : "var(--light-grey-text)" : 
                                        foundWordsWiki[word].closest === wordBeeingPlayedFormated ? 
                                             "#ffff00" : 
                                             "#fff" 
                            }}>
                                {foundWordsWiki[word]?.closest && foundWordsWiki[word].closest}
                            </span>}
                    </span>
                ));
                return [txtParts, txtParts.length];
            };
    
            const renderTxtUlArr = (txtUlArr, index) => {
                const lis = txtUlArr.slice(1).join(" ").trim().split("----li").slice(1);
                let liTxtParts, incAmount_ = 0, index_ = index;
                const txtParts = lis.map(li => {
                    [liTxtParts, incAmount_] = renderTxtArr(li.split(" "), index_);
                    index_ += incAmount_;
                    return <li href={index_} key={index_}>{liTxtParts}</li>
                });
                return [txtParts, index_ + 1]
            };
    
            let index = 0, incAmount = 0;
            return strParts.map((strPart, i) => {
                let txtParts;
                index += incAmount;
                switch (strPart[0]) {
                    case "h1":
                        [txtParts, incAmount] = renderTxtArr(strPart, index);
                        return <h1 key={index}>{txtParts}</h1>;
                    case "h2":
                        [txtParts, incAmount] = renderTxtArr(strPart, index);
                        return <h2 key={index}>{txtParts}</h2>;
                    case "h3":
                        [txtParts, incAmount] = renderTxtArr(strPart, index);
                        return <h3 key={index}>{txtParts}</h3>;
                    case "h4":
                        [txtParts, incAmount] = renderTxtArr(strPart, index);
                        return <h4 key={index}>{txtParts}</h4>;
                    case "p":
                        [txtParts, incAmount] = renderTxtArr(strPart, index);
                        return <p key={index}>{txtParts}</p>;
                    case "ul":
                        [txtParts, incAmount] = renderTxtUlArr(strPart, index);
                        return <ul key={index}>{txtParts}</ul>;
                    default: console.log("Balise inconnue :", strPart, i, strParts); return "";
                }
            });
        };
        if(Object.keys(foundWordsWiki).length > 0) {
            setRendered(renderTxt());
        }
    }, [foundWordsWiki])

    const playFormChangeHAndler = (e) => {
        setWordBeeingPlayed(e.target.value);
    };

    const submitPlayForm = e => {
        e.preventDefault();
        const word = textFormater(wordBeeingPlayed);
        const wordMatches_ = {exact:0, low:0, high:0, none: true};
        if (playedWordsWiki.includes(word)) {
            for(const key in foundWordsWiki) {    
                const foundWord = foundWordsWiki[key];  
                if(foundWord.closest === word) {
                    wordMatches_.none = false;
                    if (foundWord.similarity > 0.65) {
                        wordMatches_.exact += foundWord.occurences;
                    } else if(foundWord.similarity > 0.45) {
                        wordMatches_.high += foundWord.occurences;
                    } else {
                        wordMatches_.low += foundWord.occurences;
                    }
                }
            }
            setWordMatches(wordMatches_);
            dispatch(updateFoundWordsWiki({...foundWordsWiki}));
            return;
        }
        dispatch(updatePlayedWordsWiki([...playedWordsWiki, word]));
        let shouldUpdateFoundWords = false;
        const foundWords_ = {...foundWordsWiki};
        if (foundWords_[word] && foundWords_[word].similarity < 1) {
            const foundWord_ = {...foundWords_[word]};
            foundWord_.similarity = 1;
            foundWord_.closest = word;
            foundWords_[word] = foundWord_;
            wordMatches_.exact += foundWords_[word].occurences;
            wordMatches_.none = false;
            delete wordsToFind.current[word];
            shouldUpdateFoundWords = true;
        } 

        userService.getWordsScore(wordBeeingPlayed, wordsToFind.current, accessToken).then(result => {
            if(result.error) {
                console.log(result.error);
                if(result.error === "not_in_dictionary") {
                    setErrorMessageInvalidWord("Ce mot n'est pas dans le dictionaire.")
                }
                else if(result.error.status === 401) {
                    dispatch(show({title:"Déconnecté", text: "Il faut te reconnecter mon ami !"}))
                } else {
                    dispatch(show({title:"Ouh là ça a fait du bordel", text: "Appelle Bruno, il va te débuguer ça."}))
                }
                if(shouldUpdateFoundWords) dispatch(updateFoundWordsWiki(foundWords_));
                setWordMatches(wordMatches_);
                return;
            }
            setErrorMessageInvalidWord("");
            const target_words = result.target_words;
            for (const key in target_words) {
                const target_word = target_words[key];
                if(target_word.error) {
                    delete wordsToFind.current[key];
                } else {
                    wordMatches_.none = false;
                    if (target_word.similarity > 0.65) {
                        delete wordsToFind.current[key];
                        const foundWord_ = {...foundWords_[key]};
                        foundWord_.similarity = 1;
                        foundWord_.closest = word; 
                        foundWords_[key] = foundWord_;
                        shouldUpdateFoundWords = true;
                        wordMatches_.exact += foundWords_[key].occurences;
                    } else {
                        const foundWord_ = {...foundWords_[key]};
                        foundWord_.closest = target_word.closest;
                        foundWord_.similarity = target_word.similarity;
                        foundWords_[key] = foundWord_;
                        wordsToFind.current[key].closest = target_word.closest;
                        wordsToFind.current[key].similarity = target_word.similarity;
                        shouldUpdateFoundWords = true;
                        if(target_word.similarity > 0.45) {
                            wordMatches_.high += foundWords_[key].occurences;
                        } else {
                            wordMatches_.low += foundWords_[key].occurences;
                        }
                    }
                }
            }

            if(shouldUpdateFoundWords) dispatch(updateFoundWordsWiki(foundWords_));
            setWordMatches(wordMatches_);
        }).catch(e => {
            console.log(e);
            dispatch(show({title:"Ouh là", text: "ça a fait du bordel, appelle Bruno, il va te débuguer ça."}));
            setErrorMessageInvalidWord("");
        });
    };

    return (
        <div className="PlayBebouwikixSection">
            {popup.show && <Popup />}
            {/* <button onClick={() => {dispatch(resetPlayedWordsWiki())}}>Remettre à zéro</button> */}
            <section className="play-section">
                <form onSubmit={submitPlayForm}>
                    <input type="text" name="word" id="word-input" value={wordBeeingPlayed} onChange={playFormChangeHAndler} />
                    <input id="play-form-submit-input" type="submit" value="Envoyer" />
                    <p className="error-message-invalid-word">{errorMessageInvalidWord}</p>
                </form>
                <div className='matches-section'>
                    {wordMatches.none && <img alt="" src={redSquare}/>}
                    {new Array(wordMatches.exact).fill("").map((_, i) => <img alt="" key={i} src={greenSquare}/>)}
                    {new Array(wordMatches.low).fill("").map((_, i) => <img alt="" key={i} src={yellowSquare}/>)}
                    {new Array(wordMatches.high).fill("").map((_, i) => <img alt="" key={i} src={redSquare}/>)}
                </div>
            </section>

            <section className="wiki-page-section">
                {rendered}
            </section>
        </div>
    );
}

export default PlayBebouwikixSection;
