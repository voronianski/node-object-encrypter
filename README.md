# node-object-encrypter

> Encrypt/decrypt Javascript objects as base64 strings

## Install

```bash
npm install luvit-logger
```

## API

### ``encrypter(secret, options)``

Create an instance of encrypter, `secret` could be an array of strings as well.

### Options

- `ttl` - enable support for [TTL](http://en.wikipedia.org/wiki/Time_to_live) of the encoded data, after its' expiration you won't be able to decrypt string.

### ``encrypter.encrypt(object, [ttl])``

### ``encrypter.decrypt(generatedString)``

## Example

```javascript
var Encrypter = require('object-encrypter');
var encrypter = Encrypter('your secret', {ttl: true});

var obj = {
	userId: 12345,
	description: 'test description',
	valid: true,
	tags: ['encrypt', 'decrypt', 'ttl']
};

var hex = encrypter.encrypt(obj, 5000); // generated string will live 5 seconds
console.log(hex);
// ->
// 'eyJ1c2VySWQiOjEyMzQ1LCJkZXNjcmlwdGlvbiI6InRlc3QgZGVzY3JpcHRpb24iLCJ2YWxpZCI6dHJ1ZSwidGFncyI6WyJlbmNyeXB0IiwiZGVjcnlwdCIsInR0bCJdLCJleHBpcmVzIjoxNDEwNjkyODQ3NTU2fQo4ZTczNjhkMDc2ZWZhZWNlMGViYjYzYTAxOTBhNzU5Yw'

console.dir(encrypter.decrypt(hex));
// ->
// { userId: 12345,
// description: 'test description',
// valid: true,
// tags: [ 'encrypt', 'decrypt', 'ttl' ],
// expires: 1410692847556 }
```

---

(c) 2014 MIT License
