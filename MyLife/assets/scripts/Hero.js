var gameController = require('MainController');

cc.Class({
    extends: cc.Component,

    properties: {
        animName: '',
        canMove: true,
        speed: Number,
        tileSize: 8,
        // 场景的主地图节点
        map: cc.TiledMap,
        // 场景控制组件名称，场景控制组件必须实现eventCallBack方法
        controllerName: cc.String,
        // 判断节点是否在移动中，由场景控制组件的动作系统控制
        isMoving: false,
    },

    // use this for initialization
    onLoad: function () {
        // 主角当前各方向速度
        this.upSpeed = 0;
        this.downSpeed = 0;
        this.leftSpeed = 0;
        this.rightSpeed = 0;

        this.upLock = false;
        this.downLock = false;
        this.leftLock = false;
        this.rightLock = false;

        this.node.group = "Role"
        var collider = cc.director.getCollisionManager();
        collider.enabled = true;
        collider.enabledDebugDraw = true;

        // 拿到游戏控制组件
        this.gameControll = this.map.getComponent(this.controllerName);
        // 添加人物控制监听
        this.setInputControl();
        // TODO 拿到人物初始位置
        this.playerTile = this.startTile = this.gameControll.getStartTilePos();
        this.node.setPosition(this.gameControll.getStartPosition());
        // 人物当前的移动方向，使用数字代表，便于switch方法 上：0 下：1 左：2 右：3
        this.currentDirection = 1;

    },

    // 设置键盘控制监听
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向速度
            onKeyPressed: function (keyCode, event) {
                var direction = null;
                switch (keyCode) {
                    case cc.KEY.up:
                        console.log("press up");
                        if (!self.upLock) {
                            self.upSpeed = self.speed;
                            self.downSpeed = 0;
                            self.leftSpeed = 0;
                            self.rightSpeed = 0;
                            self.currentDirection = 0;
                        }
                        direction = "Up";
                        break;
                    case cc.KEY.down:
                        console.log("press down");
                        if (!self.downLock) {
                            self.downSpeed = -self.speed;
                            self.upSpeed = 0;
                            self.leftSpeed = 0;
                            self.rightSpeed = 0;
                            self.currentDirection = 1;
                        }
                        direction = "Down";
                        break;
                    case cc.KEY.left:
                        console.log("press left");
                        if (!self.leftLock) {
                            self.leftSpeed = -self.speed;
                            self.upSpeed = 0
                            self.downSpeed = 0;
                            self.rightSpeed = 0;
                            self.currentDirection = 2;
                        }
                        direction = "Left";
                        break;
                    case cc.KEY.right:
                        console.log("press right");
                        if (!self.rightLock) {
                            self.rightSpeed = self.speed;
                            self.upSpeed = 0
                            self.downSpeed = 0;
                            self.leftSpeed = 0;
                            self.currentDirection = 3;
                        }
                        direction = "Right";
                        break;
                }
                self.playerMoveAction(direction);
            },
            // 松开按键时，注册停止播放动画的事件，当某方向的动画播放完毕之后，回调停止播放动画事件
            onKeyReleased: function (keyCode, event) {
                var direction = null;
                switch (keyCode) {
                    case cc.KEY.up:
                        if (self.upSpeed != 0) {
                            self.upSpeed = 0;
                        }
                        direction = "Up";
                        break;
                    case cc.KEY.down:
                        if (self.downSpeed != 0) {
                            self.downSpeed = 0;
                        }
                        direction = "Down";
                        break;
                    case cc.KEY.left:
                        if (self.leftSpeed != 0) {
                            self.leftSpeed = 0;
                        }
                        direction = "Left";
                        break;
                    case cc.KEY.right:
                        if (self.rightSpeed != 0) {
                            self.rightSpeed = 0;
                        }
                        direction = "Right";
                        break;
                }
                self.playerStopAction(direction);
            }
        }, self.node);
    },

    // 碰撞回调：开始碰撞
    onCollisionEnter: function (other, self) {
        // 如果是墙体组件，不能通过
        if (other.node.group == "Wall") {
            switch (this.currentDirection) {
                case 0:
                    this.upSpeed = 0;
                    this.upLock = true;
                    this.downLock = false;
                    this.leftLock = false;
                    this.rightLock = false;
                    break;
                case 1:
                    this.downSpeed = 0;
                    this.upLock = false;
                    this.downLock = true;
                    this.leftLock = false;
                    this.rightLock = false;
                    break;
                case 2:
                    this.leftSpeed = 0;
                    this.upLock = false;
                    this.downLock = false;
                    this.leftLock = true;
                    this.rightLock = false;
                    break;
                case 3:
                    this.rightSpeed = 0;
                    this.upLock = false;
                    this.downLock = false;
                    this.leftLock = false;
                    this.rightLock = true;
                    break;
            }

            /** 算法片段说明： 由于cocos creator未提供实体节点碰撞算法，故通过以下算法自行保证两个实体碰撞不重合 */

            // 拿到节点碰撞时的世界坐标对象
            var world = self.world;
            // 拿到节点本次碰撞时边界的世界坐标
            var aabb = world.aabb;
            // 拿到节点上次碰撞时边界的世界坐标
            var preAabb = world.preAabb;
            // 拿到节点碰撞时世界坐标的坐标半径
            var r = world.radius;

            // 计算出节点两次之间的坐标偏移量，坐标系为世界坐标
            var offsetX = aabb.x - preAabb.x;
            var offsetY = aabb.y - preAabb.y;
            // 上次为未碰撞时坐标，本次为碰撞时坐标，计算出两点之间的坐标中间值，即为需要还原的边界线
            if (offsetX != 0) offsetX = offsetX / Math.abs(offsetX) * 2;
            if (offsetY != 0) offsetY = offsetY / Math.abs(offsetY) * 2;
            // 上次碰撞的世界坐标，和上面计算出的坐标中间值，两者的矢量和即为节点需要还原的世界坐标
            var point = cc.pAdd(cc.p(preAabb.x, preAabb.y), cc.pAdd(r - offsetX, r - offsetY));
            // 将计算出的世界坐标转换为节点的本地坐标
            point = this.node.parent.convertToNodeSpaceAR(point);
            // 更新节点位置
            this.node.setPosition(cc.pAdd(point , cc.p(4, 0)));
        }
        console.log("this is hero collision end");
    },

    // 碰撞回调：持续碰撞
    onCollisionStay: function (other, self) {
        // 其实在检测到碰撞时，回调函数已经保证了不在移动，这里做一层保护
        
    },

    // 碰撞回调：离开碰撞
    onCollisionExit: function (other, self) {
        // 如果是墙，只要结束了碰撞，那么所有的lock全部清除
        if (other.node.group == "Wall") {
            this.upLock = false;
            this.downLock = false;
            this.leftLock = false;
            this.rightLock = false;
        }
    },

    playerMoveToTile: function (newTile, direction) {
        this.gameControll.moveToNewTile(newTile, this, 0.15, direction);
        this.playerMoveAction(direction);
    },

    //移动动作
    playerMoveAction: function (direction) {
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.getAnimationState(this.animName + "Move" + direction);
        if (!animState.isPlaying) {
            anim.play(this.animName + "Move" + direction);
        }
    },

    // 停止当前动作，并设置对应方向的站立动作
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
        // 根据当前速度更新主角的位置
        this.node.y += this.upSpeed * dt;
        this.node.y += this.downSpeed * dt;
        this.node.x += this.leftSpeed * dt;
        this.node.x += this.rightSpeed * dt;
    },
});
