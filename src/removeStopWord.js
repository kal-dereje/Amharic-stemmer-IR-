const {stopWordList} = require('./stopWordAndAcronymsList/stopWordList');

function removeStopword(docOrQuery) {
  let words = docOrQuery.split(" ");
  words.forEach((word) => {
    stopWordList[word] ? (docOrQuery = docOrQuery.replace(word, "\b")) : null;
  });

  return docOrQuery;
}

console.log(
  removeStopword(
    "ከዓለም ዙሪያ የተውጣጡ ዜናዎችንና የተለያዩ መረጃዎችን በየዕለቱ እናቀርባለን ምንጊዜም ከቢቢሲ አማርኛ ከማንም ያልወገኑ ሚዛናዊ"
  )
);
