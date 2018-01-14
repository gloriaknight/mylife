var gameController = require('MainController');

cc.Class({
    extends: cc.Component,

    properties: {
        animName: '',
        isPause: true,
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

        // 主角当前各方向碰撞判断移动锁
        this.upLock = false;
        this.downLock = false;
        this.leftLock = false;
        this.rightLock = false;

        // 设置碰撞判断参数，节点归属组为人物组
        this.node.group = "Role"
        var collider = cc.director.getCollisionManager();
        collider.enabled = true;
        collider.enabledDebugDraw = true;

        // 拿到游戏控制组件
        this.gameControll = this.map.getComponent(this.controllerName);
        // 添加人物控制监听
        this.directionStack = [];
        this.setInputControl();
        // TODO 拿到人物初始位置
        this.playerTile = this.startTile = this.gameControll.getStartTilePos();
        this.node.setPosition(this.gameControll.getStartPosition());
        // 人物当前的移动方向，用于碰撞判断和动画播放
        this.currentDirection = "Down";

    },

    // 设置键盘控制监听
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断当前方向按键队列里是否有此按键，如果没有则插入队列头
            onKeyPressed: function (keyCode, event) {
                if (keyCode == cc.KEY.up || keyCode == cc.KEY.down || cc.KEY.left || cc.KEY.right) {
                    if (self.directionStack.indexOf(keyCode) == -1) {
                        self.directionStack.unshift(keyCode);
                    }
                }
            },
            // 松开按键时，判断当前方向按键队列里是否有此按键，如果有则剔除
            onKeyReleased: function (keyCode, event) {
                var direction = null;
                if (keyCode == cc.KEY.up || keyCode == cc.KEY.down || cc.KEY.left || cc.KEY.right) {
                    if (self.directionStack.indexOf(keyCode) != -1) {
                        self.directionStack.splice(self.directionStack.indexOf(keyCode), 1);
                    }
                }
            }
        }, self.node);
    },

    // 碰撞回调：开始碰撞
    onCollisionEnter: function (other, self) {
        // 如果是墙体组件，不能通过
        if (other.node.group == "Wall") {
            switch (this.currentDirection) {
                case "Up":
                    this.upSpeed = 0;
                    this.upLock = true;
                    this.downLock = false;
                    this.leftLock = false;
                    this.rightLock = false;
                    break;
                case "Down":
                    this.downSpeed = 0;
                    this.upLock = false;
                    this.downLock = true;
                    this.leftLock = false;
                    this.rightLock = false;
                    break;
                case "Left":
                    this.leftSpeed = 0;
                    this.upLock = false;
                    this.downLock = false;
                    this.leftLock = true;
                    this.rightLock = false;
                    break;
                case "Right":
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
            this.node.setPosition(cc.pAdd(point, cc.p(4, 0)));
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

    // 移动动作
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
        // 如果当前方向队列里面有值，则取最队列最顶端元素进行处理
        if (this.directionStack.length > 0) {
            var currentDirectionKey = this.directionStack[0];
            var canMove = false;

            switch (currentDirectionKey) {
                case cc.KEY.up: case cc.KEY.w:
                    // 设置当前方向，松开按键后，该值即为最后一次设置的值
                    this.currentDirection = "Up";
                    // 调用场景主控制器，判断是否可以移动至该方向
                    canMove = this.gameControll.tryMoveToDirection(this.currentDirection, this.speed * dt);
                    // 如果碰撞判断逻辑块中判定该方向无法移动，则锁定加速度
                    if (canMove) {
                        this.upSpeed = this.speed;
                        this.downSpeed = 0;
                        this.leftSpeed = 0;
                        this.rightSpeed = 0;
                    }
                    break;
                case cc.KEY.down: case cc.KEY.s:
                    // 设置当前方向，松开按键后，该值即为最后一次设置的值
                    this.currentDirection = "Down";
                    // 调用场景主控制器，判断是否可以移动至该方向
                    canMove = this.gameControll.tryMoveToDirection(this.currentDirection, this.speed * dt);
                    // 如果碰撞判断逻辑块中判定该方向无法移动，则锁定加速度
                    if (canMove) {
                        this.upSpeed = 0;
                        this.downSpeed = -this.speed;
                        this.leftSpeed = 0;
                        this.rightSpeed = 0;
                    }
                    break;
                case cc.KEY.left: case cc.KEY.a:
                    // 设置当前方向，松开按键后，该值即为最后一次设置的值
                    this.currentDirection = "Left";
                    // 调用场景主控制器，判断是否可以移动至该方向
                    canMove = this.gameControll.tryMoveToDirection(this.currentDirection, this.speed * dt);
                    // 如果碰撞判断逻辑块中判定该方向无法移动，则锁定加速度
                    if (canMove) {
                        this.upSpeed = 0;
                        this.downSpeed = 0;
                        this.leftSpeed = -this.speed;
                        this.rightSpeed = 0;
                    }
                    break;
                case cc.KEY.right: case cc.KEY.d:
                    // 设置当前方向，松开按键后，该值即为最后一次设置的值
                    this.currentDirection = "Right";
                    // 调用场景主控制器，判断是否可以移动至该方向
                    canMove = this.gameControll.tryMoveToDirection(this.currentDirection, this.speed * dt);
                    // 如果碰撞判断逻辑块中判定该方向无法移动，则锁定加速度
                    if (canMove) {
                        this.upSpeed = 0;
                        this.downSpeed = 0;
                        this.leftSpeed = 0;
                        this.rightSpeed = this.speed;
                    }
                    break;
            }

            // 根据当前速度更新主角的位置
            this.node.y += this.upSpeed * dt;
            this.node.y += this.downSpeed * dt;
            this.node.x += this.leftSpeed * dt;
            this.node.x += this.rightSpeed * dt;

            this.upSpeed = 0;
            this.downSpeed = 0;
            this.leftSpeed = 0;
            this.rightSpeed = 0;

            // 行走动画回调
            this.playerMoveAction(this.currentDirection);
        } else {
            // 停止动画回调
            this.playerStopAction(this.currentDirection);
        }

    },
});
