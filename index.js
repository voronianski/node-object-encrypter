var base64 = require('base64-url');
var crypto = require('crypto');

function isObject (val) {
	return Object.prototype.toString.call(val) === '[object Object]';
}

function hmac (secret, data) {
	return crypto.createHmac('md5', secret).update(data).digest('hex');
}

var hmac_length = hmac('secret', 'data').length;
function split (signatures) {
	var set = {};
	for (var i = 0, l = signatures.length; i < l; i += hmac_length) {
		set[signatures.slice(i, i+hmac_length)] = true;
	}
	return set;
}

function signer (secrets) {
	var fn = secrets
		.map(function (secret) {
			return function (data) {
				return hmac(secret, data);
			};
		})
		.reduce(function (prev, sign) {
			return function (data) {
				return prev(data) + sign(data);
			};
		});

	return fn;
}

function verifier (secrets) {
	var verify = secrets
		.map(function (secret) {
			return function (data, signatures) {
				return !!signatures[hmac(secret, data)];
			};
		})
		.reduce(function (prev, verify) {
			return function (data, signatures) {
				return prev(data, signatures) || verify(data, signatures);
			};
		});

	var fn = function (data, signature) {
		return verify(data, split(signature));
	};

	return fn;
}

module.exports = function (secrets, options) {
	secrets = [].concat(secrets);
	options = options || {ttl: false};

	var sign = signer(secrets);
	var verify = verifier(secrets);

	return {
		encrypt: function (obj, ttl) {
			if (!isObject(obj)) {
				throw new Error('Only hash-map like objects can be encrypted');
			}

			if (options.ttl) {
				obj.expires = ttl ? Date.now() + ttl : 0;
			}

			obj = JSON.stringify(obj);
			obj += '\n'+sign(obj);

			return base64.encode(obj);
		},

		decrypt: function (str) {
			if (!str) {
				return null;
			}

			str = base64.decode(str);
			var index =  str.indexOf('\n');

			if (index === -1) {
				return null;
			}

			var sig = str.slice(index+1);
			var obj = str.slice(0, index);

			if (!verify(obj, sig)) {
				return null;
			}

			try {
				obj = JSON.parse(obj);

				if (options.ttl) {
					return obj.expires >= Date.now() ? obj : null;
				}

				return obj;
			} catch(e) {
				return null;
			}
		}
	};
};
