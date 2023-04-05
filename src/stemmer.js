const { suffixList } = require("./affixDictionary/suffixList.js");
const { prefixList } = require("./affixDictionary/prefixList.js");
const { toSades } = require("./affixDictionary/toSades.js");
const { twoLetterList } = require("./affixDictionary/twoLetterList.js");
const { alphabet } = require("./affixDictionary/alphabet.js");

function stemmer(words) {
  let word = words.split(" "); //split the words and store it in array format
  let i = 0; //variable used for while loop

  while (i < word.length) {
    //check if the word is equal if we divide the word in to two and compare
    if (equalWord(word[i])) {
      i++;
      continue; //if it is equal no need to remove affixs
    }
    word[i] = removePrefix(word[i]); //removes prefix
    word[i] = removeInfix(word[i]); //removes infix
    word[i] = removeSuffix(word[i]); //removes suffix
    word[i] = endWithKabe(word[i]); //change last letter from kabe to sades
   
    i++;
  }

  return word;
}

let doc1 ="በሮች በሰው ሰዋሰው ልጆች ሰረሰረ የልጆቻችን ልጆቼ ገራገር እፅዋት ቅጠላቅጠሎች የየየየልጅ ልጆቹ በከበሮ በየሰው ሰዎቹ በየዕለቱ መረጃዎችን";
let doc2 = "በየሰው የየሰው በሰው በሬዎች በሮቻችን ትናንሽ ቀያይ ጥቋቁር ነጫጭ ቅመማቅመም ቋንቋዬ በጎች በጎቻችን በረበረ ልጆቼን ልጆቻቸውን ምንጊዜም";
let doc3 ="ውሻውምች ችግሮች ሰዋሰው ከርከሮ በየአይነት እጆቻቸው በበግ ቤት በግ ቤላ ከረሜላ ቢራቢሮዎች የሰዎቹ ፍራፍሬዎች እንደልጆች ፍራፍሬ ፍራሽ";
let doc4 ="የኮከቦች ክምችቶች የየሰው የእንስሳት በአንድኛው በሁለተኛው በምድራችን በመርከበኞች የጨረቃ የሞት ልጆችን ፀሐይን እጁን የጭለማ እንቁላሉ";
let doc5 ="እንቁራሪት ዜና ቤት መብት ፓርላማው ኢትዮጵያውያን ዜጎችን ኮሚቴው እንቁላላችን ስደተኞችንም በሴቶች ስራዎችን ግዛቶችን የኢትዮጲያዊያን";
let doc6 ="በሀገራችን የፀደይና ከነጭፍሮቻቸው እስረኞቹ በጥበቃዎች ረዕሶች ተመራማሪዎች የመንግስትን ግለሰቦች ስደተኞች ዕንቁ እንቁላላችን እንደሰው";
console.log(stemmer(doc1).join(", "));
console.log(stemmer(doc2).join(", "));
console.log(stemmer(doc3).join(", "));
console.log(stemmer(doc4).join(", "));
console.log(stemmer(doc5).join(", "));
console.log(stemmer(doc6).join(", "));

//equal word checker
function equalWord(word) {
  let wordLength = word.length;
  if (word.length % 2 == 0) {
    let wordOne = word.substring(0, wordLength / 2);
    let wordTwo = word.substring(wordLength / 2, wordLength);
    return wordOne == wordTwo ? true : false;
  }
  return false;
}

//prefix remover
function removePrefix(word) {
  let isPrefix = true;
  let wordLength = word.length;

  prefixList.forEach((prefix) => {
    let prefixLength = prefix.length;

    //if the prefix  is found at the begining of the word excute the code below
    if (word.indexOf(prefix) == 0) {
      let preRemoved = word.substring(
        word.indexOf(prefix) + prefixLength,
        wordLength
      );

      for (const suffix of suffixList) {
        if (
          word.lastIndexOf(suffix) > 1 &&
          preRemoved.length <= 4 &&
          !alphabet[preRemoved[0]] &&
          word.substring(0, word.lastIndexOf(suffix)).length < 3
        ) {
          isPrefix = false;
          break;
        }
      }
      if (isPrefix) {
        //if the second index of the word is not sebategna bet eg ሮ excute the code below
        // if (!toSades.hasOwnProperty(word[i][1])) {
        //copy letters that are left after removing prefix
        let letterLeft = word.substring(
          word.indexOf(prefix) + prefixLength,
          wordLength
        );
        //if letters left afeter removing prefix length >= 3 excute the code below
        if (letterLeft.length >= 3) {
          //if prefix length is one eg: የ  excute the code below
          if (prefixLength == 1) {
            word = letterLeft; //  update/copy letters left after removing prefix
            word = stemmer(word); //recursivly check if there is double prefix eg የየ for የየሰው
          } else word = letterLeft; // else update the word
        }
        //if letters left after removing prefix length < 3 eg የልጅ after removing will be ልጅ
        else if (letterLeft.length < 3) {
          //check if the letter left is foun in twoLetterLeft obeject update the word
          if (twoLetterList[letterLeft]) word = twoLetterList[letterLeft];
        }
      }
    }
  });

  return word;
}

//suffix remover
function removeInfix(word) {
  let wordLength = word.length;

  for (const key in alphabet) {
    let rabe = alphabet[key][3];
    let sads = alphabet[key][5];
    if (word.indexOf(rabe) > 0 && word.indexOf(rabe) < wordLength - 1) {
      if (word[word.indexOf(rabe) + 1] == sads) word = word.replace(rabe, "");
    }
  }

  if (word.indexOf("ቋ") > 0 && word.indexOf("ቋ") < word.length - 1) {
    if (word[word.indexOf("ቋ") + 1] == "ቁ") word = word.replace("ቋ", "");
  }
  return word;
}

//suffix remover
function removeSuffix(word) {
  let suffixLength;
  //for case woch ,ch, chachen, ...  suffix
  //loop through the suffixlist
  suffixList.forEach((suffix) => {
    suffixLength = suffix.length;
    //if there is suffix in the word excute code bleow
    if (word.lastIndexOf(suffix) >= 2) {
      if (suffix == "ኛው" || suffix == "ኞች" || suffix == "ኞቹ" || suffix == "ኞችንም") {
        word = word.substring(0, word.lastIndexOf(suffix));
        let letter = word[word.length - 1];
        if (alphabet[word[word.length - 1]]) {
          for (const key in alphabet) {
            if (Object.hasOwnProperty.call(alphabet, key)) {
              key == letter
                ? (word = word.replace(word[word.length - 1], alphabet[key][5]))
                : null;
            }
          }
        }
      // } else if (suffix == "ኞች" || suffix == "ኞቹ" || suffix == "ኞችንም") {
      //   word = word.substring(0, word.lastIndexOf("ኞ") + 1);
      //   for (const key in alphabet) {
      //     if (Object.hasOwnProperty.call(alphabet, key)) {
      //       alphabet[key][6] == "ኞ"
      //         ? (word = word.replace(word[word.length - 1], alphabet[key][3]))
      //         : null;
      //     }
      //   }
      } else if (suffix == "ም") {
        if (word.length - 1 == word.lastIndexOf(suffix)) {
          let prevLetter = alphabet[word[word.length - 2]];
          if (!prevLetter) word = word.substring(0, word.length - 1);
        }
      } else if (
        suffix == "ቻችን" ||
        suffix == "ችን" ||
        suffix == "ች" ||
        suffix == "ቹ" ||
        suffix == "ቼ" ||
        suffix == "ም" ||
        suffix == "ቻቸው" ||
        suffix == "ቻቸውን"
      ) {
        word = word.substring(0, word.lastIndexOf(suffix));
        let lastIndex = word.length - 1;

        let replaceLetter = toSades[word[lastIndex]];
        if (!replaceLetter) {
          for (const key in alphabet) {
            if (Object.hasOwnProperty.call(alphabet, key)) {
              if (alphabet[key][3] == word[lastIndex])
                replaceLetter = alphabet[key][5];
            }
          }
        }

        word = word.replace(new RegExp(word[lastIndex] + "$"), replaceLetter);
      } else if (suffix == "ው") {
        if (!alphabet[word[word.length - 2]])
          word = word.substring(0, word.lastIndexOf(suffix));
      }
      //  else if (suffix == "ት" && word.length > 5) {
      // }
      else if (suffix == "ን" && word.lastIndexOf("ን") < 2) {
      } else word = word.substring(0, word.lastIndexOf(suffix));
    }
  });
  return word;
}

//kabe to sades converter
function endWithKabe(word) {
  for (const key in alphabet) {
    if (Object.hasOwnProperty.call(alphabet, key)) {
      if (word[word.length - 1] == "ቁ") continue;
      else if (alphabet[key][1] == word[word.length - 1])
        word = word.replace(alphabet[key][1], alphabet[key][5]);
    }
  }
  return word;
}
