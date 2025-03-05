// style
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import "./InfosSection.css";



const InfosSection = () => {
    const { wordIndex } = useSelector(selectUser);

    return (
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
    );
};

export default InfosSection;