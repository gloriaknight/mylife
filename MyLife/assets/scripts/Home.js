cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.map = this.getComponent(cc.TiledMap);
        this.earth = this.map.getLayer("earth");
        this.maxTop = this.map.getLayer("maxTop");
        this.item = this.map.getLayer("item");
        this.startTile = cc.p(16, 31);
    },

    //[每个主场景控制器必须实现] 事件分发器
    eventCallBack: function () {
        console.log("fuck you!");
    },

    //[每个主场景控制器必须实现] 获取主角初始位置：像素Position
    getStartPosition: function () {
        var pos = this.earth.getPositionAt(this.startTile)
        return pos;
    },

    //[每个主场景控制器必须实现] 获取主角初始位置：tileMapPosition
    getStartTilePos: function () {
        return this.startTile;
    },

    //[每个主场景控制器必须实现] 判断是否可以移动至tile
    tryMoveToNewTile: function (newTile) {
        if (this.maxTop.getTileGIDAt(newTile)) {
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

    //[每个主场景控制器必须实现] 移动人物至tile
    moveToNewTile: function (newTile, role, time) {
        var pos = this.earth.getPositionAt(newTile);
        var moveAction = cc.moveTo(time, pos);
        role.runAction(moveAction);
    },

    //
    isMovedToTile: function (posInPixes, targetTile) {
        var mapSize = this.node.getContentSize();
        var tileSize = this.map.getTileSize();
        var x = Math.round(posInPixes.x / tileSize.width);
        var y = Math.round((mapSize.height - posInPixes.y) / tileSize.height) - 1;
        if (x == targetTile.x && y == targetTile.y){
            return true;
        }else{
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
