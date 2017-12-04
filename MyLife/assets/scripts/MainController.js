/**
 * 游戏主进程控制器
 * 1、负责读取玩家存档，并解析当前存档所指向的进度，加载至对应的内存结构中
 * 2、负责控制加载对应的场景
 * 3、玩家、NPC、游戏剧情交由场景控制
 * 4、提供存档读档等公共方法
 */

var gameData = require('GameDataModel');
var initRating = 0;
var isHeroCanMove = true;

module.exports = {
    //初始化方法
    init: init,
    //初始化进度
    initRating: initRating,
    //主角是否可以移动
    isHeroCanMove: isHeroCanMove,
    //新建游戏
    newGame: newGame
}

/**
 * 游戏初始化类
 */
function init() {
    cc.info("game initing...");
};

/**
 * 新游戏
 */
function newGame() {
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

    cc.sys.localStorage.setItem('userData', JSON.stringify(gameData));
    cc.sys.localStorage.setItem('i18n', 'en');
    cc.info(gameData);
    //从上一个加载点开始游戏
    continueGame();
}

/**
 * 从上一个加载点开始游戏
 */
function continueGame() {
    var scene = gameData.userData.playerLastScene || "Home";
    cc.director.loadScene(scene);
    cc.info("continue your life");
}
