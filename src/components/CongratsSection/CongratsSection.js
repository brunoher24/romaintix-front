// services
import { emojis, numToEmojis } from "../../services/utilities";
// style
import "./CongratsSection.css";


const CongratsSection = ({playedWords}) => {

  const displayStats = () => {
    return emojis.slice(1).map(emoji => {
      const length = playedWords.filter(w => w.emoji === emoji).length;
      const num = length < 10 ? 1 : Math.floor(length / 10);
      return [Array(num).fill(emoji).map((e, i) => (
        <span key={i}>{e}</span>
      )), numToEmojis(length)];
    });
  };

  const findNextWord = () => {
    // TODO
  };

  return (
    <div className="congrats-popup">
      <p>
        <b>Bravo !</b> Tu as trouvé en {" "}
        <b><span id="tries">{playedWords.length} coups</span></b>.
        Résumé :
      </p>
      <p>
        <span id="meter">🥳<br />
          {displayStats().map(([es, nums], i) => (
            <span className="icon-img-num-ctnr" key={i}>
              {es}{nums}<br />
            </span>
          ))}

        </span>
      </p>
      <button onClick={findNextWord}>Mot suivant</button>
    </div>
  );
};

export default CongratsSection;