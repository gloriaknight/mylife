cc.Class({
    extends: cc.Component,

    properties: {
        // 像素误差修正值
        errorPixel:0.0001
    },

    // use this for initialization
    onLoad: function () {
        this.map = this.getComponent(cc.TiledMap);
        this.earth = this.map.getLayer("earth");
        this.wallDown = this.map.getLayer("wallDown");
        this.item = this.map.getLayer("item");
        this.startTile = cc.p(16, 31);
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

    // [每个主场景控制器必须实现] 判断是否可以移动至tile
    tryMoveToNewTile: function (newTile) {
        if (this.wallDown.getTileGIDAt(newTile)) {
            console.log("this way is blocked");
            return false;
        }

        if (this.item.getTileGIDAt(newTile)) {
            console.log("you've touched an item");
            this.eventCallBack();
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
        if (direction == "Up" || direction == "Left"){
            errorPixelFix = -this.errorPixel;
            // 向上向左时向上取整
            x = Math.ceil((posInPixes.x + errorPixelFix) / tileSize.width);
            y = Math.ceil((mapSize.height - posInPixes.y + errorPixelFix) / tileSize.height) - 1;
        }else{
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
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
