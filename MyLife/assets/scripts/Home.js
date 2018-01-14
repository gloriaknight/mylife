var gameData = require('GameDataModel');

cc.Class({
    extends: cc.Component,

    properties: {
        // 像素误差修正值
        errorPixel: 0.0001,
        // 剧情控制类
        storyScriptUtilsNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // 基本初始化
        this.map = this.getComponent(cc.TiledMap);
        this.earth = this.map.getLayer("earth");
        this.wallDown = this.map.getLayer("wallDown");
        this.item = this.map.getLayer("item");
        this.startTile = cc.p(16, 31);
        this.storyScriptUtils = this.storyScriptUtilsNode.getComponent("StoryScriptUtils");

        // 如果当前剧情节点在这个list之内，则在场景一开始就加载对应的剧情脚本
        this.storyLoadOnStartList = ["0001", "0007"];

        // 当前是否处于剧情中，预留标志位，后续用于锁定用户输入等
        this.isInStory = false;

        // 测试数据，代替gameData.userData.playerInfo.currentStroyNode值，不用每次都走新建游戏流程，记得替换
        var currntNode = "0001";

        // 根据剧情配置，判断是否走剧情
        if (this.storyLoadOnStartList.indexOf(currntNode) >= 0) {
            // 当前正处于剧情中
            this.isInStory = true;
            // 异步加载剧情脚本
            this.storyScriptUtils.loadStoryScript(currntNode);
        }
    },

    // [每个主场景控制器必须实现] 事件分发器
    eventCallBack: function () {
        console.log("got event : fuck you!");
    },

    // [每个主场景控制器必须实现] 获取主角初始位置：像素Position
    getStartPosition: function () {
        var pos = this.earth.getPositionAt(this.startTile)
        return pos;
    },

    // [每个主场景控制器必须实现] 获取主角初始位置：tileMapPosition
    getStartTilePos: function () {
        return this.startTile;
    },

    // [每个主场景控制器必须实现] 判断某方向是否可以移动
    tryMoveToDirection: function (direction, speedInDt) {
        var posInPixes = cc.pAdd(this.node.getChildByName("hero").position, cc.p(-4, -8));

        var mapSize = this.node.getContentSize();
        var tileSize = this.map.getTileSize();
        var errorPixelFix = this.errorPixel;
        var x = 0;
        var y = 0;
        // 判断当前人物的行走方向，用来修正坐标像素误差，向上向左时负修正，向下向右时正修正
        if (direction == "Left") {
            errorPixelFix = -this.errorPixel;
            x = Math.floor((posInPixes.x + errorPixelFix - speedInDt) / tileSize.width);
            y = Math.floor((mapSize.height - posInPixes.y + errorPixelFix) / tileSize.height) - 1;
        } else if (direction == "Up") {
            errorPixelFix = -this.errorPixel;
            x = Math.floor((posInPixes.x + errorPixelFix) / tileSize.width);
            y = Math.floor((mapSize.height - posInPixes.y + errorPixelFix + speedInDt) / tileSize.height) - 1;
        } else if (direction == "Right") {
            x = Math.ceil((posInPixes.x + errorPixelFix + speedInDt) / tileSize.width);
            y = Math.floor((mapSize.height - posInPixes.y + errorPixelFix) / tileSize.height) - 1;
        } else if (direction == "Down") {
            x = Math.ceil((posInPixes.x + errorPixelFix) / tileSize.width);
            y = Math.ceil((mapSize.height - posInPixes.y + errorPixelFix - speedInDt) / tileSize.height) - 1;
        }


        var currentTile = cc.p(x, y);
        console.log("*****************");
        console.log(direction);
        console.log(posInPixes);
        console.log(currentTile);
        console.log("------------------");

        if (this.wallDown.getTileGIDAt(currentTile)) {
            console.log("this way is blocked");
            return false;
        }

        return true;
    },

    // [每个主场景控制器必须实现] 移动人物至tile
    moveToNewTile: function (newTile, role, time, direction) {
        var pos = this.earth.getPositionAt(newTile);
        // 注册动作执行完毕之后，停止动画的回调
        var finished = cc.callFunc(function (target, direction) {
            role.node.emit('stopPlayAnimation', direction);
            role.setIsMoving(false);
        }, this, direction);
        var moveAction = cc.sequence(cc.moveTo(time, pos), finished);
        role.setIsMoving(true);
        role.node.runAction(moveAction);
    },

    // [每个主场景控制器必须实现] 判断是否已经移动到指定的图块
    isMovedToTile: function (posInPixes, targetTile, direction) {
        var mapSize = this.node.getContentSize();
        var tileSize = this.map.getTileSize();
        var errorPixelFix = this.errorPixel;
        var x = 0;
        var y = 0;
        // 判断当前人物的行走方向，用来修正坐标像素误差，向上向左时负修正，向下向右时正修正
        if (direction == "Up" || direction == "Left") {
            errorPixelFix = -this.errorPixel;
            // 向上向左时向上取整
            x = Math.ceil((posInPixes.x + errorPixelFix) / tileSize.width);
            y = Math.ceil((mapSize.height - posInPixes.y + errorPixelFix) / tileSize.height) - 1;
        } else {
            // 向下向右时向下取整
            x = Math.floor((posInPixes.x + errorPixelFix) / tileSize.width);
            y = Math.floor((mapSize.height - posInPixes.y + errorPixelFix) / tileSize.height) - 1;
        }

        if (x == targetTile.x && y == targetTile.y) {
            return true;
        } else {
            return false;
        }
    },

    getPlayerPos: function () {
        var position = this.node.getChildByName("hero").position;
        return position;
    },

    story0001Init: function () {
        console.log("Initing Story0001...");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
