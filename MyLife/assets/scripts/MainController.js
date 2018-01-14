/**
 * 游戏主进程控制器
 * 1、负责读取玩家存档，并解析当前存档所指向的进度，加载至对应的内存结构中
 * 2、负责控制加载对应的场景
 * 3、玩家、NPC、游戏剧情交由场景控制
 * 4、提供存档读档等公共方法
 */
var gameData = require('GameDataModel');

cc.Class({
    extends: cc.Component,

    properties: {
        // 是否完成初始化，每次进入游戏时，默认为false，gameInitor方法完全执行成功之后置为true
        isInited: false,
        // 初始化进度百分比
        initRating: 0,
        // 重试次数
        retryTimes: 0,
    },

    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
    },

    /**
     * 新游戏
     */
    newGame: function () {
        cc.info("new game");
        //新建游戏时，初始化游戏各种参数
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

        gameData.userData.playerInfo.currentStroyNode = "0001";
        gameData.userData.playerInfo.storyNodeList = ["0001"];

        cc.sys.localStorage.setItem('userData', JSON.stringify(gameData));
        cc.sys.localStorage.setItem('i18n', 'en');
        cc.info(gameData);
        //从上一个加载点开始游戏
        this.continueGame();
    },

    /**
     * 从上一个加载点开始游戏
     */
    continueGame: function () {
        var scene = gameData.userData.playerLastScene || "Home";
        cc.director.loadScene(scene);
        cc.info("continue your life");
    },

    /**
     * 游戏初始化类
     */
    gameInitor: function () {
        var self = this;
        // 1 读取物品数据到内存中
        cc.loader.load(cc.url.raw('resources/data/Items.json'), function(err, res){
            if (err) {
                console.log(err);
            }else{
                // AJAX异步调用加载缓存
                var str = JSON.stringify(res);
                self.itemCacheInitor(str);
            }
        });
        // 2 读取技能数据到内存中
        cc.loader.load(cc.url.raw('resources/data/Skills.json'), function(err, res){
            if (err) {
                console.log(err);
            }else{
                // AJAX异步调用加载缓存
                var str = JSON.stringify(res);
                self.skillCacheInitor(str);
            }
        });
        
        // 3 读取NPC数据到内存中
        cc.loader.load(cc.url.raw('resources/data/Npcs.json'), function(err, res){
            if (err) {
                console.log(err);
            }else{
                // AJAX异步调用加载缓存
                var str = JSON.stringify(res);
                self.npcCacheInitor(str);
            }
        });

        // 4 读取剧情线到内存中
        cc.loader.load(cc.url.raw('resources/storyscripts/storyLine.json'), function(err, res){
            if (err) {
                console.log(err);
            }else{
                // AJAX异步调用加载缓存
                self.storyLine = res;
            }
        });

    },

    // 系统加载文件完毕之后的回调，将加载结果写入缓存中，并根据当前的语言进行多语言处理
    itemCacheInitor: function(filedata){
        console.log(filedata);
        
    },
    skillCacheInitor: function(filedata){
        console.log(filedata);
    },
    npcCacheInitor: function(filedata){
        console.log(filedata);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});