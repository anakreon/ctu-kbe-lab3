import { createHash } from 'crypto';

export const hash = (data) => createHash("sha1").update(data, "binary").digest("hex");

const letters = generateCharArray('a', 'z');
const numbers = generateCharArray('0', '9');

export const crackSha1Hash = (hashed, salt) => {
    const input = letters.concat(numbers);
    const length = 5;
    return generateCombinations(input, length, (combination) => {
        if (hash(combination + salt) == hashed) {
            return combination;
        }
    }, '');
} 

function generateCombinations (input, length, callback, appendString) {
    if (appendString.length == length) {
        return callback(appendString);
    } 
    for(var i = 0; i < input.length; i++) {
        const resultCombination = generateCombinations(input, length, callback, appendString + input[i]);
        if (resultCombination) return resultCombination;
    }
}

function generateCharArray (from, to) {
    const charArray = []
    for (var i = from.charCodeAt(0); i <= to.charCodeAt(0); ++i) {
        const letter = String.fromCharCode(i);
        charArray.push(letter);
    }
    return charArray;
}