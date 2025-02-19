/**
 iZ³ | Izzzio blockchain - https://izzz.io
 @author: Andrey Nedobylsky (admin@twister-vl.ru)
 */

const express = require("express");
const Wallet = require("./wallet");
const storj = require('./instanceStorage');
const utils = require('./utils');

/**
 * Wallet and RPC interface
 *
 */
class Frontend {
    constructor(wallet, blockchain, transactor, blockHandler, app, blockchainObject, options, getLastBlock, getSomeInfo, transact, hardResync) {
        let that = this;
        this.app = app;
        this.wallet = wallet;
        this.blockchain = blockchain;
        this.transactor = transactor;
        this.getLastBlock = getLastBlock;
        this.getSomeInfo = getSomeInfo;
        this.blockHandler = blockHandler;
        this.transact = transact;
        this.hardResync = hardResync;
        this.options = options;
        this.blockchainObject = blockchainObject;

        app.use(express.static('frontend'));
        //app.get('/', this.index);
        app.get('/getInfo', function (req, res) {
            that.getInfo(req, res)
        });

        app.get('/isReadyForTransaction', function (req, res) {
            that.isReadyForTransaction(req, res)
        });


        app.post('/createWallet', function (req, res) {
            that.createWallet(req, res)
        });


        app.post('/resyncBlockchain', function (req, res) {
            that.resyncBlockchain(req, res)
        });

        app.post('/resyncAll', function (req, res) {
            that.resyncAll(req, res)
        });

        app.get('/downloadWallet', function (req, res) {
            that.downloadWallet(req, res)
        });

        app.post('/restoreWallet', function (req, res) {
            that.restoreWallet(req, res)
        });

        app.post('/changeWallet', function (req, res) {
            that.restoreWallet(req, res)
        });


        storj.put('httpServer', app);

    }

    index(req, res) {
        res.send('Shalom');
    }

    getInfo(req, res) {
        let that = this;
        let data = {
            balance: that.wallet.balance,
            address: that.wallet.getAddress(false),
            tiny: that.wallet.getAddress(true)
        };

        that.getSomeInfo(function (miners, minerForce, peers) {
            that.getLastBlock(function (block, maxBlock) {
                data.block = block;
                data.maxBlock = maxBlock;
                data.miners = miners;
                data.minerForce = minerForce;
                data.peers = peers;
                data.syncInProgress = that.blockHandler.syncInProgress;
                data.recivingBlocks = storj.get('chainResponseMutex');
                data.isReadyForTransaction = that.blockchainObject.isReadyForTransaction();
                data.options = that.options;
                let wallet = JSON.parse(JSON.stringify(that.wallet));
                delete wallet.keysPair;
                data.wallet = wallet;
                res.send(data);
            });
        });

    }

    isReadyForTransaction(req, res) {
        let that = this;
        res.send(JSON.stringify(that.blockchainObject.isReadyForTransaction()));
    }


    /**
     * Create new wallet
     * @param req
     * @param res
     */
    createWallet(req, res) {
        let wallet = new Wallet(false, this.blockchain.config);
        res.send({id: wallet.id, public: wallet.keysPair.public, private: wallet.keysPair.private});

    }


    resyncBlockchain(req, res) {
        let that = this;
        that.blockHandler.resync();
        res.send({status: 'ok'});
    }

    /**
     * Download wallet file
     * @param req
     * @param res
     */
    downloadWallet(req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="wallet.json"'
        });
        res.write(JSON.stringify(this.wallet));

        res.end();
    }

    resyncAll(req, res) {
        let that = this;
        that.hardResync();
        res.send();
    }

    restoreWallet(req, res) {
        let that = this;

        utils.waitForSync(function () {
            that.wallet.keysPair.public = req.body.public;
            that.wallet.keysPair.private = req.body.private;
            that.wallet.id = req.body.id;
            that.wallet.block = Number(req.body.block);
            that.wallet.balance = Number(req.body.balance);
            that.wallet.update();

            if(that.wallet.selfValidate()) {
                setTimeout(function () {
                    that.blockHandler.resync(function () {
                        res.send({status: 'ok'});
                    });
                }, 1000);
            } else {
                res.send({status: 'error', message: 'Incorrect wallet or keypair'});
            }
        });


    }

}

module.exports = Frontend;
