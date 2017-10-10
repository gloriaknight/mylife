var gameData = require('GameDataModel');
cc.Class({
    extends: cc.Component,

    properties: {
        pageNum: 4,
        pageTemplate: cc.Prefab,
        target: cc.PageView,
        label: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        cc.info("player's name is " + gameData.userData.playerInfo.playerName);
    },

    jumpToStatusSettings(){
        this.target.scrollToPage(0);
    },

    jumpToSkillSettings(){
        this.target.scrollToPage(1);
    },

    jumpToKnowledgeSettings(){
        this.target.scrollToPage(2);
    },

    jumpToSocialSettings(){
        this.target.scrollToPage(3);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
