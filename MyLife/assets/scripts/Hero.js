var gameController = require('MainController');

cc.Class({
    extends: cc.Component,

    properties: {
        animName: '',
        canMove: true,
        speed: 8,
        tileSize: 8,
        // 场景的主地图节点
        map: cc.TiledMap,
        // 场景控制组件名称，场景控制组件必须实现eventCallBack方法
        controllerName: cc.String,
        // 判断节点是否在移动中，由场景控制组件的动作系统控制
        isMoving: false,
        // 当前人物的行走方向，用来修正坐标像素误差，向上向左时负修正，向下向右时正修正
        currentDirection: 'Down'
    },

    // use this for initialization
    onLoad: function () {
        this.moveLock = false;
        //拿到游戏控制组件
        this.gameControll = this.map.getComponent(this.controllerName);
        //添加人物控制监听
        this.setInputControl();
        //拿到人物初始位置
        this.playerTile = this.startTile = this.gameControll.getStartTilePos();
        this.node.setPosition(this.gameControll.getStartPosition());
    },

    setIsMoving: function (isMoving) {
        this.isMoving = isMoving;
    },

    tryMoveToNewTile: function (newTile) {
        return this.gameControll.tryMoveToNewTile(newTile);
    },

    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向速度
            onKeyPressed: function (keyCode, event) {
                // 只要一直按着方向键，都要关闭停止动画的事件响应，因为即使无法移动到下一个格子，也要播放动画
                self.node.off('stopPlayAnimation', self.playerStopAction, self);
                // 如果人物正处于移动过程中，即moveLock为true，不响应键盘的移动指令
                if (!self.moveLock) {
                    var newTile = cc.p(self.playerTile.x, self.playerTile.y);
                    var direction = null;
                    switch (keyCode) {
                        case cc.KEY.up:
                            console.log("press up");
                            newTile.y -= 1;
                            direction = "Up";
                            break;
                        case cc.KEY.down:
                            console.log("press down");
                            newTile.y += 1;
                            direction = "Down";
                            break;
                        case cc.KEY.left:
                            console.log("press left");
                            newTile.x -= 1;
                            direction = "Left";
                            break;
                        case cc.KEY.right:
                            console.log("press right");
                            newTile.x += 1;
                            direction = "Right";
                            break;
                    }
                    console.log(self.playerTile);
                    console.log(newTile);

                    // 判断是否能够移动到下一个tile，同时触发事件回调
                    var canMoveTo = self.tryMoveToNewTile(newTile);

                    // 如果能够移动至下一个tile
                    if (canMoveTo) {
                        // 人物移动指令触发之后，设置moveLock为true，等待移动完成解除moveLock
                        self.moveLock = true;
                        // 更新人物当前行动方向
                        self.currentDirection = direction;
                        // 更新人物当前tile
                        self.playerTile.x = newTile.x;
                        self.playerTile.y = newTile.y;
                        // 如果判断能够移动，实现移动动作并播放动画
                        self.playerMoveToTile(newTile, direction);
                    }

                }
            },
            // 松开按键时，注册停止播放动画的事件，当某方向的动画播放完毕之后，回调停止播放动画事件
            onKeyReleased: function (keyCode, event) {
                // 注意在各个主场景控制器中必须实现动画播放完毕的回调
                self.node.on('stopPlayAnimation', self.playerStopAction, self);
                // 松开之后，判断动画人物是否在移动，如果没有处在移动状态，则直接停止播放动画
                if (!self.isMoving) {
                    var direction = null;
                    switch (keyCode) {
                        case cc.KEY.up:
                            direction = "Up";
                            break;
                        case cc.KEY.down:
                            direction = "Down";
                            break;
                        case cc.KEY.left:
                            direction = "Left";
                            break;
                        case cc.KEY.right:
                            direction = "Right";
                            break;
                    }
                    self.playerStopAction({ 'detail': direction });
                }
            }
        }, self.node);
    },

    playerMoveToTile: function (newTile, direction) {
        this.gameControll.moveToNewTile(newTile, this, 0.25, direction);
        this.playerMoveAction(direction);
    },

    //移动动作
    playerMoveAction: function (direction) {
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.getAnimationState(this.animName + "Move" + direction);
        if (!animState.isPlaying) {
            anim.play(this.animName + "Move" + direction);
        }
        console.log("fuck you");
    },

    //停止当前动作，并设置对应方向的站立动作
    playerStopAction: function (event) {
        console.log(event);
        var direction = event.detail;
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.getAnimationState(this.animName + "Move" + direction);
        if (animState.isPlaying) {
            anim.stop(this.animName + "Move" + direction);
            anim.play(this.animName + "Stand" + direction);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //如果玩家到达预定的tile，解除moveLock
        if (this.gameControll.isMovedToTile(this.gameControll.getPlayerPos(), this.playerTile, this.currentDirection)) {
            this.moveLock = false;
        }
    },
});
