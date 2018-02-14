// pages/dotpic/DotPicMain.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        x: 0,
        y: 0,
        gridNum: 16,
        color: "#FF0000",
        gridSize: 0,
        backColor: "#FFFFFF",
        tilePosX: 0,
        tilePosY: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.actionList = [];
        this.redoList = [];
        this.colorMap = null;
        this.setData({ gridSize: 305 / this.data.gridNum });
        this.ctx = wx.createCanvasContext("canvas");
        this.clearCanvas();
        this.initColorMap();
        console.log(this.data.gridSize);
    },

    /**
     * 清空画布。需要用户确认
     */
    clearCanvas: function () {
        this.ctx.setFillStyle(this.data.backColor);
        this.ctx.fillRect(0, 0, 305, 305);
        this.ctx.draw(true);
    },

    /**
     * 更改网格数量。需要用户确认
     */
    changeCanvasSize: function (e) {
        if (this.data.gridNum == e.currentTarget.dataset.gridnum) {
            return;
        }

        this.setData({
            gridNum: e.currentTarget.dataset.gridnum
        });
        this.setData({ gridSize: 305 / this.data.gridNum });
        this.actionList = [];
        this.redoList = [];
        this.colorMap = null;
        this.clearCanvas();
        this.initColorMap();
    },

    /**
     * 初始化颜色二维数组，存放每个方格的颜色
     */
    initColorMap: function () {
        var num = this.data.gridNum;
        this.colorMap = new Array();
        for (var i = 0; i < num; i++) {
            this.colorMap[i] = new Array();
            for (var j = 0; j < num; j++) {
                this.colorMap[i][j] = [];
            }
        }
        console.log(this.colorMap);
    },

    /**
     * 更改画笔颜色
     */
    changeColor: function (e) {
        this.setData({
            color: e.currentTarget.dataset.color
        });
    },

    /**
     * 保存图片
     */
    savePic: function () {
        wx.canvasToTempFilePath({
            canvasId: "canvas",
            success: function (res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (res) {
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                })
            }
        });
    },

    /**
     * DOT按键按下
     */
    dotPushStart: function (e) {

    },

    /**
     * DOT按键抬起
     */
    dotPushEnd: function (e) {

    },

    /**
     * 画布触摸开始
     */
    canvasTouchStart: function (e) {

    },

    /**
     * 画布触摸移动
     */
    canvasTouchMove: function (e) {

    },

    /**
     * 画布触摸结束
     */
    canvasTouchEnd: function (e) {

    },

    /**
     * 绘画使能函数
     */
    dot: function (e) {
        // 从点击事件中获取当前点击坐标
        this.setData({
            x: e.touches[0].x,
            y: e.touches[0].y
        });

        // 从全局变量中获取方格颜色
        var drawColor = this.data.color;

        // 计算当前坐标所属方格，并返回方格原点坐标
        var point = this.calcGridCoordinate(this.data.x, this.data.y);

        this.setData({
            tilePosX: point.x,
            tilePosY: point.y
        });

        console.log(this.data.tilePosX);

        // 在画布中绘制方格
        this.ctx.setFillStyle(drawColor);
        this.ctx.fillRect(point.x, point.y, this.data.gridSize, this.data.gridSize);
        this.ctx.draw(true);

        // 记录事件
        this.actionRecorder(point.tx, point.ty, drawColor);
    },

    /**
     * 计算当前坐标所属方格，并返回方格原点坐标
     */
    calcGridCoordinate: function (px, py) {
        var tileX = Math.floor(px / this.data.gridSize);
        var tileY = Math.floor(py / this.data.gridSize);

        var pixelX = tileX * this.data.gridSize;
        var pixelY = tileY * this.data.gridSize;

        return { x: pixelX, y: pixelY, tx: tileX, ty: tileY };
    },

    /**
     * 记录绘画动作
     */
    actionRecorder: function (tileX, tileY, color) {
        if (!tileX || !tileY || !color) {
            return;
        }
        var action = {
            "x": tileX,
            "y": tileY,
            "color": color
        };

        this.actionList.unshift(action);
        if (this.redoList.length > 0) {
            if (this.redoList[0].x == action.x && this.redoList[0].y == action.y && this.redoList[0].color == action.color) {
                this.redoList.shift();
            } else {
                this.redoList = [];
            }
        }

        this.colorMap[tileX][tileY].push(color);
    },

    /**
     * 重做绘画动作
     */
    redo: function () {
        if (this.redoList.length == 0) {
            return;
        }
        var action = this.redoList.shift();
        this.actionList.unshift(action);

        this.colorMap[action.x][action.y].push(action.color);

        var color = this.colorMap[action.x][action.y][this.colorMap[action.x][action.y].length - 1];

        this.ctx.setFillStyle(color);
        this.ctx.fillRect(action.x * this.data.gridSize, action.y * this.data.gridSize, this.data.gridSize, this.data.gridSize);
        this.ctx.draw(true);
    },

    /**
     * 撤销绘画动作
     */
    undo: function () {
        if (this.actionList.length == 0) {
            return;
        }
        var action = this.actionList.shift();
        this.redoList.unshift(action);

        this.colorMap[action.x][action.y].pop();

        var color = null;
        if (this.colorMap[action.x][action.y].length == 0) {
            color = this.data.backColor;
        } else {
            color = this.colorMap[action.x][action.y][this.colorMap[action.x][action.y].length - 1];
        }

        this.ctx.setFillStyle(color);
        this.ctx.fillRect(action.x * this.data.gridSize, action.y * this.data.gridSize, this.data.gridSize, this.data.gridSize);
        this.ctx.draw(true);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})