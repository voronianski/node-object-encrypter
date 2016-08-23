var should = require('should');

describe('node-object-encrypter', function () {
    var Encrypter = require('../');
    var encrypter, hex, original, obj;

    describe('while initialization', function () {
        it('should exist', function () {
            encrypter.should.be.ok;
        });
    });

    before(function () {
        encrypter = Encrypter('your secret string', {ttl: true});
    });

    describe('encrypt js object', function () {
        before(function () {
            obj = {
                userId: 12345,
                description: 'test description',
                valid: true,
                tags: ['encrypt', 'decrypt', 'ttl']
            };
            hex = encrypter.encrypt(obj, 1000);
        });

        it('should return a hex string', function () {
            hex.should.be.type('string');
        });

        describe('decrypt js object', function () {
            before(function () {
                original = encrypter.decrypt(hex);
            });

            it('should return an object', function () {
                original.should.be.type('object');
            });

            it('should be the same as original object', function () {
                original.should.have.keys('userId', 'description', 'valid', 'tags', 'expires');
                original.should.containDeep(obj);
            });

            describe('after ttl time outs', function () {
                before(function (done) {
                    setTimeout(function () {
                        original = encrypter.decrypt(hex);
                        done();
                    }, 1000)
                });

                it('should NOT return valid object', function () {
                    (original === null).should.be.true;
                });
            });
        });
    });
});
