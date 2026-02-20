import zero from "../assets/numbers/0.png";
import one from "../assets/numbers/1.png";
import two from "../assets/numbers/2.png";
import three from "../assets/numbers/3.png";
import four from "../assets/numbers/4.png";
import five from "../assets/numbers/5.png";
import six from "../assets/numbers/6.png";
import seven from "../assets/numbers/7.png";
import eight from "../assets/numbers/8.png";
import nine from "../assets/numbers/9.png";

import degreesPercents from "../assets/degreesPercents.json";

// const generateDegreesPercentsJson = () => {
//   const degreesPercents = [{d: 2500, p: 1}];

//   for(let percents = 1, degrees = 2501; degrees <= 6430; degrees++) {
//     if(degrees <= 3600) {
//       percents += 9/11;
//     } else if (degrees <= 4900) {
//       percents += 90 / 1300;
//     } else if (degrees <= 6430) {
//       percents += 9 / 1530;
//     }
  
//     degreesPercents.push({d: degrees / 100, p: Math.floor(percents)});
//   }
  
//   degreesPercents.push({d: 100, p: 1000}); console.log(JSON.stringify(degreesPercents))

//   console.log(JSON.stringify(degreesPercents));
  
// };

//const emojiNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => ['0x003'+num,'0xFE0F','0x20E3']);
const emojiNums = [zero, one, two, three, four, five, six, seven, eight, nine].map((img, i) =>({img, alt:i}));

export const emojis = ["🥳", "😱", "🔥", "🥵", "😎", "🥶"];

  export const numToEmojis = (num) => {
    return num.toString().split("").map((n, i) => (
    // <span role="img" aria-label="1" key={i}>
    //   {String.fromCodePoint(emojiNums[n][0], emojiNums[n][1], emojiNums[n][2])}
    // </span>
    
    <img key={i} className="img-num" src={emojiNums[n].img} alt={emojiNums[n].alt}/>
    ));
  };

  export const setCorrectEmojiToTemperature = (temperature) => {
    if (temperature < 0) return emojis[5]
    if (temperature < 25) return emojis[4]
    if (temperature < 36) return emojis[3]
    if (temperature < 49) return emojis[2]
    if (temperature < 64.3) return emojis[1]
    return emojis[0];
  };

  export const scoreFormater = (result) => {
    let nestedData = result;

    while(nestedData.data) {
      nestedData = nestedData.data
    }
    if(nestedData.error) {
      console.log(nestedData.error);
      return {error:nestedData.error};
    }
    const score = nestedData.similarity;
    const degrees = Math.round((score * 10000 - 500)) / 100;
    let percents;
    if(degrees === 95) {
      percents = 1000;
    } else if (degrees > 62.59) {
      percents = 999;
    } else if (degrees < 25) {
      percents = 0;
    } else if(degrees >= 25 && degrees < 100) {
      percents = degreesPercents.find(dp => dp.d === degrees ).p;
    } else {
      console.log("une erreur inconnue est survenue");
      return {error: "une erreur inconnue est survenue"};
    }
    return {degrees, percents};
  }

  export const textFormater = (txt) => {
   return txt
   .replace(/[éèëê]/, "e")
   .replace(/[àäâ]/, "a")
   .replace(/[ùûü]/, "u")
   .replace(/[îìï]/, "i")
   .replace(/[ôòö]/, "o")
   .replace(/ç/, "c").toLowerCase();
  }