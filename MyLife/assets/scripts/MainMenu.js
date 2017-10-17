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
        //todo tips:new game will override your current file
        cc.warn("new game will override your current file");
        //init player's basic info
        cc.sys.localStorage.removeItem('userData');
        cc.info(Math.random().toString(36).substr(2));
        gameData.userData.playerInfo.playerName = Math.random().toString(36).substr(2);
        gameData.userData.playerInfo.playerSex = "boy" + Math.random().toString(36).substr(2);
        gameData.userData.playerInfo.playerAge = "11.5" + Math.random().toString(36).substr(2);
        gameData.userData.playerInfo.playerGrade = "9";

        gameData.userData.playerInfo.playerHp = 100;
        gameData.userData.playerInfo.playerStr = 100;
        gameData.userData.playerInfo.playerFame = 100;
        gameData.userData.playerInfo.playerFrt = 100;
        gameData.userData.playerInfo.playerSpi = 100;
        gameData.userData.playerInfo.playerStd = 100;
        gameData.userData.playerInfo.playerPhy = 100;

        gameData.userData.playerInfo.playerLevel = 0;
        gameData.userData.playerInfo.playerExp = 0;

        gameData.userData.playerInfo.money = 30;

        cc.sys.localStorage.setItem('userData', JSON.stringify(gameData));
        cc.info(gameData);
    },

    /*
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
    */

    continueFunc: function () {
        //if item userData not exist , cannot continue
        if (custTools.isEmpty(cc.sys.localStorage.getItem('userData'))) {
            cc.error("item userData not exist , cannot continue");
            return;
        }
        gameData = JSON.parse(cc.sys.localStorage.getItem('userData'));
        cc.info(gameData);
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
