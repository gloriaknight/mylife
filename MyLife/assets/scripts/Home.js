var gameData = require('GameDataModel');
const i18n = require('LanguageData');

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

        this.setInputControl();
        this.keyStack = [];

        // 当前是否处于剧情中，预留标志位，后续用于锁定用户输入等
        this.isInStory = false;
        this.isInTextStory = false;
        // 剧情脚本是否加载完成，异步加载完成回调后置true。后续用于增加页面loading图，锁定用户输入
        this.isLoaded = false;

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

    // 设置键盘控制监听
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断当前方向按键队列里是否有此按键，如果没有则插入队列头
            onKeyPressed: function (keyCode, event) {
                if (self.keyStack.indexOf(keyCode) == -1) {
                    self.keyStack.unshift(keyCode);
                }
                // 如果当前处在文本类剧情中，并且用户按下了空格键，执行下一个脚本
                if (self.isInTextStory) {
                    if (self.keyStack[0] == cc.KEY.enter) {
                        self.storyScriptUtils.parseStoryScript();
                    }
                }
            },
            // 松开按键时，判断当前方向按键队列里是否有此按键，如果有则剔除
            onKeyReleased: function (keyCode, event) {
                if (self.keyStack.indexOf(keyCode) != -1) {
                    self.keyStack.splice(self.keyStack.indexOf(keyCode), 1);
                }
            }
        }, self.node);
    },

    // [有剧情线的主场景控制器必须实现] 加载完成回调
    storyLoadedCallBack: function () {
        console.log("loaded");
        this.storyScriptUtils.parseStoryScript();
    },

    // [有剧情线的主场景控制器按需实现] 富文本展示（立绘）
    showRichText: function (nodeName, showText) {
        // 获取对应角色节点，新建立绘sprite
        var node = this.node.getChildByName(nodeName);

        // 去国际化文件中，获取实际展示的字符串
        var showStr = i18n.t(showText);

        // 根据上面拿到的数据绘制UI。等待UI统一设计完成
        console.log("RolePaint:" + node.name + " ShowText:" + showStr);

        // 等待用户输入，才进行下一个剧情函数，放在update函数中判定，如果当前在剧情中，并且用户按下了空格键，执行下一个脚本。解析到其他类型脚本时，置为false
        this.isInTextStory = true;
    },

    // [有剧情线的主场景控制器必须实现] 人物头顶展示文本
    showAboveHeadText: function (nodeName, showText) {
        // 获取对应角色节点，根据角色节点位置，计算出头顶位置，绘制对话框
        var node = this.node.getChildByName(nodeName);

        // 去国际化文件中，获取实际展示的字符串
        var showStr = i18n.t(showText);

        // 根据上面拿到的数据绘制UI。等待UI统一设计完成
        console.log("AboveHead:" + node.name + " ShowText:" + showStr);

        // 等待用户输入，才进行下一个剧情函数，放在update函数中判定，如果当前在剧情中，并且用户按下了空格键，执行下一个脚本。解析到其他类型脚本时，置为false
        this.isInTextStory = true;
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

    story0001Init: function (params) {
        console.log("Initing Story0001..." + params);
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {

    //},
});
