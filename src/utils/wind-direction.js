// Converts wind degrees (between 0 and 360) into wind direction.
const windDirection = (degrees) => {
  var windDegree = degrees;

  if (windDegree < 11.25) {
    return "North";
  } else if (windDegree < 33.75) {
    return "NNE";
  } else if (windDegree < 56.25) {
    return "NE";
  } else if (windDegree < 78.75) {
    return "ENE";
  } else if (windDegree < 101.25) {
    return "E";
  } else if (windDegree < 123.75) {
    return "ESE";
  } else if (windDegree < 146.25) {
    return "SE";
  } else if (windDegree < 168.75) {
    return "SSE";
  } else if (windDegree < 191.25) {
    return "S";
  } else if (windDegree < 213.75) {
    return "SSW";
  } else if (windDegree < 236.25) {
    return "SW";
  } else if (windDegree < 258.75) {
    return "WSW";
  } else if (windDegree < 281.25) {
    return "W";
  } else if (windDegree < 303.75) {
    return "WNW";
  } else if (windDegree < 326.25) {
    return "NW";
  } else if (windDegree < 348.75) {
    return "NNW";
  } else {
    return "N";
  }
};

module.exports = windDirection;
