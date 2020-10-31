# ctu-kbe-lab3

Uses Javascript (NodeJs) to solve tasks 5 and 9.
All tasks and conclusions below.

## Install & Execute

To install:
1) Install NodeJs **v14+**
2) Run the following:
```bash
> npm install
```

To run the tests:
```bash
> npm test
```

## Task 1: Login without password
  - simple comment after username in the username section will mask out the password requirement

  username: `hulamart';#`
  password: `<any string>`

  Resulting SQL query: 
  ```sql
  SELECT username FROM users WHERE username = 'hulamart';#' AND password = SHA1('<any string>' . '$salt')
  ```

**task1.js** - contains 2 functions: `xorEncrypt(plaintext, key)` and `xorDecrypt (hexciphertext, key)` that encrypt and decrypt hex text with a xor key

**task1.test.js** - contains sample conversions using these functions
  - these include `the world is yours` against the key `illmatic` - the cipher text is `1d04094d161b1b0f0d4c051e410d06161b1f`

## Exercise 2: decrypt single-letter xor

Patterns present in this ciphertext due to the weak mode of encryption are:
  - letters repeated in the plaintext are repeated in the ciphertext as well (0x48 = letter 'l' is present 6-times)
  - word 'dolla' is repeated twice both in the plaintext as in the ciphertext(404b484845)

**task2.test.js** - contains function call decoding the hex-encoded ciphertext `404b48484504404b48484504464d4848045d4b` encoded with a single-letter key `$`. The plain text is `dolla dolla bill yo`.

## Exercise 3: hand crack single-letter xor

**task3.test.js** - ciphertext in `text1.hex` has been encoded with a single **letter** -> key has been discovered using brute force
  - key is `M`, first line of plaintext is: `Busta Rhymes up in the place, true indeed`

## Exercise 4: automate cracking single-letter xor

**task4.js** - contains function: `xorAutoDecrypt (hexciphertext)` which automatically decrypts ciphertext encoded with a single letter key
  - the algorithm uses an external vocabulary with word-matching & counting technique - it iterates over all the possible keys - the correct text will contain most of the recognized words
  - due to use of a an English vocabulary, it can only solve English texts

**task4.test.js** - contains automated conversion of `text1.hex`