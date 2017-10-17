var gameData = require('GameDataModel');
cc.Class({
    extends: cc.Component,

    properties: {
        pageNum: 4,
        target: cc.PageView
    },

    // use this for initialization
    onLoad: function () {
        cc.info("player's name is " + gameData.userData.playerInfo.playerName);
        //根据存档数据初始化
        if (this.target.getCurrentPageIndex() == 0) {
            this.initStatusPage();
        }
    },

    initStatusPage() {
        cc.info("enter player status page");
        //状态设置的两个layout，0：左边页  1：右边页
        var statusSettingPage = this.target.getComponent(cc.PageView).content._children[0].children;
        //left page , player status
        var playerStausPage = statusSettingPage[0];
        //right page , player inventory
        var playerInventoryPage = statusSettingPage[1];
        //userdata
        var userData = gameData.userData.playerInfo;
        cc.info(userData);

        //init playStatus
        for (var i = 0; i < playerStausPage.children.length; i++) {
            var node = playerStausPage.children[i];
            if (node.name == 'HP_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerHp;
            }
            else if (node.name == 'STR_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerStr;
            }
            else if (node.name == 'FAME_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerFame;
            }
            else if (node.name == 'FRT_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerFrt;
            }
            else if (node.name == 'SPI_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerSpi;
            }
            else if (node.name == 'STD_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerStd;
            }
            else if (node.name == 'LEVEL_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerLevel;
            }
            else if (node.name == 'EXP_label') {
                node.children[0].getComponent(cc.Label).string = userData.playerExp;
            }
        }
        cc.info(playerStausPage.children);
    },

    jumpToStatusSettings() {
        this.target.scrollToPage(0);
    },

    jumpToSkillSettings() {
        this.target.scrollToPage(1);
    },

    jumpToKnowledgeSettings() {
        this.target.scrollToPage(2);
    },

    jumpToSocialSettings() {
        this.target.scrollToPage(3);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
