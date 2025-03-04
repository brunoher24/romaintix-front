function generateDegreesPercentsJson() {
    const degreesPercents = [{d: 2500, p: 1}];

    for(let percents = 1, degrees = 2501; degrees <= 6430; degrees++) {
      if(degrees <= 3600) {
        percents += 9/11;
      } else if (degrees <= 4900) {
        percents += 90 / 1300;
      } else if (degrees <= 6430) {
        percents += 9 / 1530;
      }
    
      degreesPercents.push({d: degrees / 100, p: Math.floor(percents)});
    }
    
    degreesPercents.push({d: 100, p: 1000}); console.log(JSON.stringify(degreesPercents))

    console.log(JSON.stringify(degreesPercents));
    
  }