var custTools = require('CommonTools');
var gameData = require('GameDataModel');
var gameController = require('MainController');
const i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,

    properties: {
        btnNewGame: {
            default: null,
            type: cc.Button
        },
        btnContinue: {
            default: null,
            type: cc.Button
        },
        btnSettings: {
            default: null,
            type: cc.Button
        },
        btnExit: {
            default: null,
            type: cc.Button
        },
    },

    // use this for initialization
    onLoad: function () {
        if (custTools.isEmpty(cc.sys.localStorage.getItem('i18n'))) {
            cc.warn("use default language zh");
            i18n.init('zh');
        }else{
            i18n.init(cc.sys.localStorage.getItem('i18n'));
        }
        var menuBtnGroup = this.node.getComponent(cc.Node);
        this.btnNewGame.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.newgame');
        this.btnContinue.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.continue');
        this.btnSettings.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.settings');
        this.btnExit.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.exit');
    },

    newGameFunc: function () {
        gameController.newGame();
    },

    continueFunc: function () {
        //if item userData not exist , cannot continue
        if (custTools.isEmpty(cc.sys.localStorage.getItem('userData'))) {
            cc.error("item userData not exist , cannot continue");
            return;
        }
        gameData = JSON.parse(cc.sys.localStorage.getItem('userData'));
        gameController.continueGame();
        cc.info(gameData);
    },

    settingsFunc: function () {
        cc.info("fuck settings");
        cc.director.loadScene("GameSettings");
    },

    exitFunc: function () {
        cc.info("### clear localStorage ###");
        cc.sys.localStorage.clear();
        i18n.init('en');
        i18n.updateSceneRenderers();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
