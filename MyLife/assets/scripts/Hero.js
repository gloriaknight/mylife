var gameController = require('MainController');

cc.Class({
    extends: cc.Component,

    properties: {
        animName: '',
        canMove: true,
        speed: 8,
        tileSize: 8,
        //场景的主地图节点
        map: cc.TiledMap,
        //场景控制组件名称，场景控制组件必须实现eventCallBack方法
        controllerName: cc.String
    },

    // use this for initialization
    onLoad: function () {
        this.upperSpeed = 0;
        this.downSpeed = 0;
        this.leftSpeed = 0;
        this.rightSpeed = 0;
        this.moveLock = false;
        //拿到游戏控制组件
        this.gameControll = this.map.getComponent(this.controllerName);
        //添加人物控制监听
        this.setInputControl();
        //拿到人物初始位置
        this.playerTile = this.startTile = this.gameControll.getStartTilePos();
        this.node.setPosition(this.gameControll.getStartPosition());
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
                        // 更新人物当前tile
                        self.playerTile.x = newTile.x;
                        self.playerTile.y = newTile.y;
                        // 如果判断能够移动，实现移动动作并播放动画
                        self.playerMoveToTile(newTile);
                    }

                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function (keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.up:
                        console.log("release up");
                        if (self.upperSpeed != 0) {
                            self.upperSpeed = 0;
                            self.playerStopAction("Up");
                        }
                        break;
                    case cc.KEY.down:
                        console.log("release down");
                        if (self.downSpeed != 0) {
                            self.downSpeed = 0;
                            self.playerStopAction("Down");
                        }
                        break;
                    case cc.KEY.left:
                        console.log("release left");
                        if (self.leftSpeed != 0) {
                            self.leftSpeed = 0;
                            self.playerStopAction("Left");
                        }
                        break;
                    case cc.KEY.right:
                        console.log("release right");
                        if (self.rightSpeed != 0) {
                            self.rightSpeed = 0;
                            self.playerStopAction("Right");
                        }
                        break;
                }
            }
        }, self.node);
    },

    playerMoveToTile: function (newTile) {
        this.gameControll.moveToNewTile(newTile, this.node, this.tileSize / this.speed);
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
    playerStopAction: function (direction) {
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
        if (this.gameControll.isMovedToTile(this.gameControll.getPlayerPos(), this.playerTile)){
            this.moveLock = false;
        }
    },
});
