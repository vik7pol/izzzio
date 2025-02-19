/**
 iZ³ | Izzzio blockchain - https://izzz.io

 Copyright 2018 Izio LLC (OOO "Изио")

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Class realises universal functions for cryptography in project
 */

const logger = new (require('./logger'))();

const CodingFunctions = require('./codingFunctions');


/**
 * Repair bad generated key
 * @param key
 * @return {*}
 */
function repairKey(key) {
    if(key[key.length - 1] !== "\n") {
        key += "\n";
    }
    return key.replace(new RegExp("\n\n", 'g'), "\n");
}

/**
 * Cryptography modules
 */
class Cryptography {
    constructor(config = {}) {
        this.utils = require('./utils');

        this._hashFunctions = {};
        this._signFunctions = {};
        this._generatorFunctions = {};

        this.config = config;
        this.config.hashFunction = this.config.hashFunction ? this.config.hashFunction.toUpperCase() : this.config.hashFunction;
        this.config.signFunction = this.config.signFunction ? this.config.signFunction.toUpperCase() : this.config.signFunction;

        this.repairKey = repairKey;

        let GostSign, GostDigest;
        //If GOST cryptography enabled, require libraries
        if(this.config.hashFunction === 'STRIBOG' || this.config.hashFunction === 'STRIBOG512' || this.config.signFunction === 'GOST' || this.config.signFunction === 'GOST512') {
            try {
                GostSign = require('../plugins/GOSTModules/gostSign');
                GostDigest = require('../plugins/GOSTModules/gostDigest');
            } catch (e) {
                logger.fatal('GOST plugin not found');
                process.exit();
            }
        }

        this.coding = new CodingFunctions();

        let hashOptions, signOptions;
        if(config) {
            //Hash config
            switch (this.config.hashFunction) {
                case 'STRIBOG':
                    hashOptions = {length: 256};
                    break;
                case 'STRIBOG512':
                    hashOptions = {length: 512};
                    break;
            }
            //Signature config
            switch (this.config.signFunction) {
                case 'GOST':
                    signOptions = {hash: "GOST R 34.11", length: 256};
                    break;
                case 'GOST512':
                    signOptions = {hash: "GOST R 34.11", length: 512, namedCurve: "T-512-A"};
                    break;
            }
        }
        //Create digest
        if(hashOptions) {
            this.gostDigest = new GostDigest(hashOptions);
        }
        //Create signer
        if(signOptions) {
            this.gostSign = new GostSign(signOptions);
        }

    }

    /**
     * Register external hash function
     * @param {string} name
     * @param {function} func
     */
    registerHash(name, func) {
        this._hashFunctions[name.toUpperCase()] = func;
    }

    /**
     * Register external sign function
     * @param {string} name
     * @param {function} validate
     * @param {function} sign
     */
    registerSign(name, validate, sign) {
        this._signFunctions[name.toUpperCase()] = {validate: validate, sign: sign};
    }

    /**
     * Register generator
     * @param {string} name
     * @param {function} func
     */
    registerGenerator(name, func) {
        this._generatorFunctions[name.toUpperCase()] = func;
    }

    /**
     * convert data data to buffer (all strings consider as utf8 format only)
     * @param data
     * @returns {Buffer}
     */
    data2Buffer(data) {
        let bData;
        try {
            bData = this.coding.Chars.decode(data, 'utf8');

        } catch (e) {
            bData = this.coding.Chars.decode(JSON.stringify(data), 'utf8');
        }
        return bData;
    }

    /**
     * convert key from PEM format to Hex string
     * @param key PEM key
     * @param kind kind of the key: public or private
     * @returns {string} base64 encoded key
     * @constructor
     */
    PEMToHex(key, kind = 'PUBLIC') {
        let k = this.coding.PEM.decode(key, `rsa ${kind} key`);
        let hex = this.coding.Hex.encode(k);
        hex = hex.replace(new RegExp(/\r\n/, 'g'), "");
        return hex;
    }

    /**
     * convert key from Hex string to PEM format
     * @param key
     * @param kind
     * @returns {*|String|string|CryptoOperationData|Uint8Array}
     * @constructor
     */
    hexToPem(key, kind = 'PUBLIC') {
        key = key.replace(new RegExp(/\r\n/, 'g'), "");
        let k = this.coding.Hex.decode(key);
        let pem = this.coding.PEM.encode(k, `RSA ${kind} KEY`);
        return pem;
    }

    /**
     * convert key from PEM format to Utf16 string
     * @param key PEM key
     * @param kind kind of the key: public or private
     * @returns {string} base64 encoded key
     * @constructor
     */
    PEMToUtf16(key, kind = 'PUBLIC') {
        let k = this.coding.PEM.decode(key, `rsa ${kind} key`);
        let hex = this.coding.Hex.encode(k);
        hex = hex.replace(new RegExp(/\r\n/, 'g'), "");
        return this.utils.hexString2Unicode(hex);
    }

    /**
     * convert key from Utf16 string to PEM format
     * @param key
     * @param kind
     * @returns {*|String|string|CryptoOperationData|Uint8Array}
     * @constructor
     */
    utf16ToPem(key, kind = 'PUBLIC') {
        key = this.utils.unicode2HexString(key).replace(new RegExp(/\r\n/, 'g'), "");
        let k = this.coding.Hex.decode(key);
        let pem = this.coding.PEM.encode(k, `RSA ${kind} KEY`);
        return pem;
    }

    /**
     * convert ArrayBuffer to unicode string
     * @param key {ArrayBuffer}
     * @returns {*|string}
     */
    bufferToUtf16(key) {
        let k = this.coding.Hex.encode(key).replace(new RegExp(/\r\n/, 'g'), "");
        k = this.utils.hexString2Unicode(k);
        return k;
    }

    /**
     * convert unicode string to ArrayBuffer
     * @param key {string} unicode string
     * @returns {*|string}
     */
    utf16ToBuffer(key) {
        let k = this.utils.unicode2HexString(key);
        k = this.coding.Hex.decode(k);
        return k;
    }


    /**
     * Generates pair of keys
     * @returns {{private: *, public: *}}
     */
    generateKeyPair() {

        //External generator function
        if(this._generatorFunctions[this.config.generatorFunction]) {
            return this._generatorFunctions[this.config.generatorFunction]();
        }

        let keyPair;
        if(this.gostSign) {
            keyPair = this.gostSign.generateKey();
            keyPair.public = this.coding.Hex.encode(keyPair.publicKey).replace(new RegExp(/\r\n/, 'g'), "");
            keyPair.private = this.coding.Hex.encode(keyPair.privateKey);
        } else {
            logger.fatal('No generation functions found');
            return {private: '', public: ''};
        }
        if(this.config.signFunction === 'NEWRSA') {
            //get old rsa key in PEM format and convert to utf-16
            keyPair.public = this.PEMToHex(keyPair.public);
        }
        return {private: keyPair.private, public: keyPair.public};
    }

    /**
     * signs data
     * @param data
     * @param key
     * @returns {{data: *, sign: *}}
     */
    sign(data, key) {
        let signedData;

        //External sign function
        if(this._signFunctions[this.config.signFunction]) {
            signedData = this._signFunctions[this.config.signFunction].sign(data, key);
        } else {
            if(this.gostSign) {
                let bData, bKey;
                //prepare data for processing
                bData = this.data2Buffer(data);
                bKey = this.coding.Hex.decode(key);

                signedData = this.gostSign.sign(bKey, bData);
                signedData = this.coding.Hex.encode(signedData);
            } else {
                logger.fatal('No sign functions found');
                return {data: data, sign: ''};
            }
            signedData = signedData.replace('\r\n', ''); //delete wrong symbols
        }
        return {data: data, sign: signedData};
    }

    /**
     * verifies signed data
     * @param data
     * @param sign
     * @param key
     * @returns {boolean} true or false
     */
    verify(data, sign, key) {
        if(typeof data === 'object') {
            sign = data.sign;
            data = data.data;
        }

        //External sign function
        if(this._signFunctions[this.config.signFunction]) {
            return this._signFunctions[this.config.signFunction].validate(data, sign, key);
        }

        let result;
        if(this.gostSign) {
            let bData, bKey, bSign;
            bData = this.data2Buffer(data);
            bKey = this.coding.Hex.decode(key);
            bSign = this.coding.Hex.decode(sign);
            result = this.gostSign.verify(bKey, bSign, bData);
        } else {
            logger.fatal('No verify functions found');
            return false;
        }
        return result;
    }

    /**
     * creates hash of the data
     * @param {string/ArrayBufferTypes}data
     * @returns {Buffer}
     */
    hash(data = '') {

        //External hash function
        if(this._hashFunctions[this.config.hashFunction]) {
            return this._hashFunctions[this.config.hashFunction](data);
        }

        let bData = this.data2Buffer(data);
        let hashBuffer;
        if(this.gostDigest) {
            hashBuffer = this.gostDigest.digest(bData);
        } else {
            logger.fatal('No hash functions found');
            return '';
        }
        return this.coding.Hex.encode(hashBuffer).replace('\r\n', '');
    }
}

module.exports = Cryptography;