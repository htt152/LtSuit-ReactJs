const SplitString = (s,l) => {
  let returnString = "";
  let currentIndex = 1;
  let lengthPerSplit;
  if (!l){
    lengthPerSplit=60;
  }
  else{
    lengthPerSplit=l;
  }
  let startPos = 0;
  let endPos = lengthPerSplit;
  if(!s){
    return
  }
  if (s.length <= lengthPerSplit) {
    return s;
  }
  while (currentIndex * lengthPerSplit <= s.length) {
    returnString = returnString + s.substring(startPos, endPos);
    currentIndex++;
    startPos = endPos;
    endPos = currentIndex * lengthPerSplit;
    if (currentIndex === 4) {
      returnString += "...";
      return returnString;
    }
    if (s[startPos] !== " ") {
      returnString += " ";
    }
  }
  returnString += s.substring(startPos, endPos);
  return returnString;
};

export default SplitString;
