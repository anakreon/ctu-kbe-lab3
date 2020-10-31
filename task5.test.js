import chai from 'chai';
import { crackSha1Hash, hash } from './task5.js';

const { expect } = chai;

describe('crackSha1Hash', () => {    
    it('my password', () => {
        const hashed = '026f5211efb57728d3491b795d560ee7504a1de8';
        const salt = '5651a';
        const expectedResult = 'a0e9d';
        const plain = crackSha1Hash(hashed, salt);
        expect(plain).to.equal(expectedResult);
    });
});
describe('hash', () => {
    it('teacher password', () => {
        const hashed = '2d55131b6752f066ee2cc57ba8bf781b4376be85';
        const salt = 'kckct';
        const plaintext = 'fm9fytmf7q';
        const hashedResult = hash(plaintext + salt);
        expect(hashedResult).to.equal(hashed);
    });
})
