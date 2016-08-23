# node-object-encrypter

[![build status](http://img.shields.io/travis/voronianski/node-object-encrypter.svg?style=flat)](https://travis-ci.org/voronianski/node-object-encrypter)

> Encrypt/decrypt JavaScript objects as base64 strings with optional TTL support.

## Install

```bash
npm install object-encrypter
```

## API

### ``encrypter(secret, options)``

Create an instance of encrypter, `secret` could be a `string` or an `array` of strings.

### Options

- `ttl` - enable support for [TTL](http://en.wikipedia.org/wiki/Time_to_live) of the encoded data, after its' expiration you won't be able to decrypt a string, default `false`.

- `algorithm` - cipher algorithm that will be used to encrypt/decrypt data. You can check the list of available ciphers with [`crypto.getCiphers()`](http://nodejs.org/api/crypto.html#crypto_crypto_getciphers), default `aes-256-cbc`.

- `outputEncoding` - option should be one of `'latin1'`, `'base64'` (default) or `'hex'`.

It returns 2 methods that will do the main thing encryption/decryption of an object.

### ``.encrypt(object, [ttl])``

Returns [Base64](http://en.wikipedia.org/wiki/Base64) encoded string. `ttl` is `ms` value of during how long time this string could be decrypted, it's needed only if [`ttl` option](https://github.com/voronianski/node-object-encrypter#options) is enabled.

### ``.decrypt(generatedString)``

Returns original object value if no errors occured (or time to live is not expired), in other cases returns `null`.

## Example

```javascript
var encrypter = require('object-encrypter');
var engine = encrypter('your secret', {ttl: true});

var obj = {
	userId: 12345,
	description: 'test description',
	valid: true,
	tags: ['encrypt', 'decrypt', 'ttl']
};

var hex = engine.encrypt(obj, 5000); // generated string will live 5 seconds
console.log(hex);
// ->
// 'eyJ1c2VySWQiOjEyMzQ1LCJkZXNjcmlwdGlvbiI6InRlc3QgZGVzY3JpcHRpb24iLCJ2YWxpZCI6dHJ1ZSwidGFncyI6WyJlbmNyeXB0IiwiZGVjcnlwdCIsInR0bCJdLCJleHBpcmVzIjoxNDEwNjkyODQ3NTU2fQo4ZTczNjhkMDc2ZWZhZWNlMGViYjYzYTAxOTBhNzU5Yw'

console.dir(engine.decrypt(hex));
// ->
// { userId: 12345,
// description: 'test description',
// valid: true,
// tags: [ 'encrypt', 'decrypt', 'ttl' ],
// expires: 1410692847556 }
```

---

(c) 2014 MIT License
