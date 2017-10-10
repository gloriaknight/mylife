/**
 * 全局单例，游戏缓存对象。
 * 1、游戏启动时，从localStorage里面加载初始化
 * 2、游戏关闭时自动销毁
 * 3、保存时，将本数据体push至localStorage
 * 4、加载时，将localStorage覆盖拉取至本数据体
 * 5、所有的数据模型均在此类中维护，不再单独起model类
 */

var userData = new UserData();
var gameSettings = new GameSettings();

module.exports = {
    userData: userData,
    gameSettings: gameSettings
}

/**
 * 玩家信息类
 */
function PlayerInfo() {
    this.playerName = "";
    this.currentStatus = "";
    this.currentClass = "";
    this.currentTest = "";
    this.money = "";
    this.playerLevel = "";
    this.playerExp = "";
    this.playerHp = "";
    this.playerStr = "";
    this.playerFame = "";
    this.playerFrt = "";
    this.playerSpi = "";
    this.playerStd = "";
    this.playerPhy = "";
};

/**
 * 玩家所学技能
 */
function PlayerSkill() {

};

/**
 * 玩家物品栏类
 */
function PlayerInventory() {

};

/**
 * 玩家所掌握知识
 */
function PlayerKnowledge() {

};

/**
 * 全局设置
 */
function GameSettings() {
    this.isInit = false;
    this.initRating = 0;
    this.i18n = "zh_cn";
    this.resolution = "";
    this.isFullscreen = false;
    this.volume = 50;
    this.currentProfileNum = -1;
};

/**
 * 用户数据
 */
function UserData() {
    this.playerInfo = new PlayerInfo();
    this.playerSkill = new PlayerSkill();
    this.playerInventory = new PlayerInventory();
    this.playerKnowledge = new PlayerKnowledge();
};

// TODO 2017/09/25 考虑玩家技能和课程知识点如何管理，是使用原生JavaScript的原型链来定义，还是使用cc.Class的extends来定义
// 结论：使用原生JS的Function定义类型

/**
 * 定义玩家技能
 */
function Skill() {

}


/**
 * 定义课程知识点
 */
function Knowledge() {

}

function Equipment() {

}

function Backpack(){
    
}