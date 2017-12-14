var custTools = require('CommonTools');
var gameData = require('GameDataModel');
const i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,

    properties: {
        // 新游戏按钮
        btnNewGame: {
            default: null,
            type: cc.Button
        },
        // 继续游戏按钮
        btnContinue: {
            default: null,
            type: cc.Button
        },
        // 游戏设置按钮
        btnSettings: {
            default: null,
            type: cc.Button
        },
        // 退出游戏按钮
        btnExit: {
            default: null,
            type: cc.Button
        },
        gameControllerNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.gameController = this.gameControllerNode.getComponent("MainController");
        
        if (custTools.isEmpty(cc.sys.localStorage.getItem('i18n'))) {
            cc.warn("use default language zh");
            i18n.init('zh');
        } else {
            i18n.init(cc.sys.localStorage.getItem('i18n'));
        }
        var menuBtnGroup = this.node.getComponent(cc.Node);
        this.btnNewGame.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.newgame');
        this.btnContinue.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.continue');
        this.btnSettings.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.settings');
        this.btnExit.node.children[0].getComponent(cc.Label).string = i18n.t('label_text.exit');

        // 游戏初始化加载类，如果失败，重试最多3次，由于加载资源是异步的过程，所以不在这里同步等待
        this.gameController.gameInitor();
    },

    newGameFunc: function () {
        this.gameController.newGame();
    },

    continueFunc: function () {
        //if item userData not exist , cannot continue
        if (custTools.isEmpty(cc.sys.localStorage.getItem('userData'))) {
            cc.error("item userData not exist , cannot continue");
            return;
        }
        gameData = JSON.parse(cc.sys.localStorage.getItem('userData'));
        this.gameController.continueGame();
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
