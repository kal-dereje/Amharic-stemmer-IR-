const {abbreveations} = require('./stopWordAndAcronymsList/acronymList');

function tokenization(docOrQuery){
    let regularExp =  /[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]/g;
    docOrQuery = docOrQuery.replace(regularExp, "")
    let words = docOrQuery.split(" ");
    
    words.forEach(word => {
        abbreveations[word] ?docOrQuery =  docOrQuery.replace(word, abbreveations[word]) : null
    });
    
    return docOrQuery
}

console.log(tokenization("aቤadfdsfds/ክ1"));


