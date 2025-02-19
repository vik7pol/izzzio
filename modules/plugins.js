/**
 * Class realises universal functions for external plugins in project
 */
const logger = new (require('./logger'))();
const storj = require('./instanceStorage');
let cryptography = storj.get('cryptography');
let that;

class Plugins {

    constructor() {
        that = this;
        /**
         * object to store registered functions
         */
        this.functions = {};
        this._injectedScripts = [];

        this.ecma = {
            registerFunction: that._registerFunction,
            injectScript: that._injectScript,
            getAllRegisteredFunctionsAsObject: that._getAllRegisteredFunctionsAsObject,
            injectedScripts: that._injectedScripts,
        };

        this.crypto = {
            registerHash: cryptography.registerHash,
            registerGenerator: cryptography.registerGenerator,
            registerSign: cryptography.registerSign,
            registerGeneratorHook: cryptography.registerGeneratorHook,
        };

    }


    /**
     * add external function from plugin as private function of the class
     * @param {string} namespace
     * @param {string} functionName
     * @param {function} functionObject
     */
    _registerFunction(namespace, functionName, functionObject) {
        if(typeof (functionObject) === 'function') {
            if(namespace.length !== 0) {
                that.functions[`_${namespace}.${functionName}`] = functionObject;
            } else {
                that.functions[`_${functionName}`] = functionObject;
            }
        } else {
            logger.warning(`Object registered by name ${namespace}.${functionName} is not a function. It's registration canceled.`)
        }
    }

    /**
     * returns object of all registered plugins
     * @param {function} cb
     */
    _getAllRegisteredFunctionsAsObject(cb) {
        let obj = {};
        for (let funcName in that.functions) {
            if(that.functions.hasOwnProperty(funcName)) {
                obj[funcName.replace('_', '')] = function (...args) {
                    return that.functions[funcName](cb, ...args);
                }
            }
        }
        return obj;
    }

    _injectScript(script) {
        that._injectedScripts.push("" + script);
    }
}

module.exports = Plugins;