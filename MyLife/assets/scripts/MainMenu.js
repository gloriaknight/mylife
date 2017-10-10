var custTools = require('CommonTools');
var jsonFile = require('JsonFileHelper');
var gameData = require('GameDataModel');
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
        var button = this.node.getComponent(cc.Button);
    },

    newGameFunc: function () {
        cc.info("################### Function Test");
        if (!cc.sys.isNative) {
            cc.error("not native!");
            return;
        }
        //5.use localstorage at native , see what happens.we take array for test , every time we boot , add a item to it
        //5.1 get userData from localStorage , if null ,init it
        var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
        if (custTools.isEmpty(userData)) {
            cc.info("userData from localStorage is null!");
            userData = new Array('firstPush');
        } else {
            cc.info("userData from localStorage is not null. userData is " + userData);
        }
        //5.2 add new item to userData
        userData.push('foo');
        cc.info("we push foo to userData , now is " + userData);
        //5.3 set it back to localStorage
        cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
        cc.info("after set , userData form localStorage is " + JSON.parse(cc.sys.localStorage.getItem('userData')));
        cc.info("################### test end")
    },

    continueFunc: function () {
        cc.info("### test for global data");
        gameData.userData.playerInfo.playerName = "fuckOff";
        cc.info(gameData.userData.playerInfo.playerName);
    },

    settingsFunc: function () {
        cc.info("fuck settings");
        cc.director.loadScene("GameSettings");
    },

    exitFunc: function () {
        cc.info("### clear localStorage ###");
        cc.sys.localStorage.clear();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
