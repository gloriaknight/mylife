var custTools = require('CommonTools');
cc.Class({
    extends: cc.Component,

    properties: {
        // 场景的主地图节点
        scene: cc.Node,
        // 场景控制组件名称，场景控制组件必须实现eventCallBack方法
        controllerName: cc.String,
    },

    // use this for initialization
    onLoad: function () {
        this.storyNodeId = "";
        this.storyScriptLines = [];
        // 异步加载脚本，判断是否加载完成
        this.isLoaded = false;
        // 拿到游戏控制组件
        this.gameControll = this.scene.getComponent(this.controllerName);
        // 当前执行到脚本的index
        this.currentStoryScriptIndex = 0;
    },

    // 使用AJAX异步加载剧情脚本，加载完成之后回调各场景控制器，开始走剧情
    loadStoryScript: function (storyNodeId) {
        var self = this;
        this.storyNodeId = storyNodeId;
        var storyScriptUrl = "resources/storyscripts/story" + this.storyNodeId + ".script"

        console.log("loading story script " + this.storyNodeId + "...");

        cc.loader.load(cc.url.raw(storyScriptUrl), function (err, res) {
            if (err) {
                console.log(err);
            } else {
                // AJAX异步调用加载缓存
                var lines = res.split("\r\n");
                for (let index = 0; index < lines.length; index++) {
                    var element = lines[index].trim();
                    if (!custTools.isEmpty(element) && element.indexOf("#") != 0) {
                        self.storyScriptLines.push(element);
                    }
                }

                self.isLoaded = true;
                self.gameControll.storyLoadedCallBack();

                console.log(self.storyScriptLines);
            }
        });
    },

    // 解析剧情脚本，分发给各个具体实现函数
    parseStoryScript: function () {
        // 调用当前剧情节点的剧情脚本，等待处理由具体函数处理
        var elements = this.storyScriptLines[this.currentStoryScriptIndex].trim().split(" ");
        // elements各字段含义参照《剧情脚本命令格式.xlsx》
        // GETROLE：角色控制类
        if (elements[0] == "GETROLE") {
            // 文本展示 ShowText [showType,showText]
            if (elements[2] == "ShowText") {
                this.nodeShowTextFunc(elements[1], elements[3]);
            }
        }

        // 执行完成当前节点之后，脚本索引++
        this.currentStoryScriptIndex++;
    },

    // 文本展示类，第一个参数为节点名，第二个参数为参数数组
    nodeShowTextFunc: function (nodeName, params) {
        /**
         *  1、根据nodeName去场景控制器中找到对应的子节点
         *  2、判断文本展示类型，如果为头上展示，回调人物节点的函数，如果为立绘展示，回调场景控制器的函数
         */
        var paramArray = params.split("(")[1].split(")")[0].split(",");
        var showType = paramArray[0];
        var showText = paramArray[1];

        if (showType == "richText") {
            this.gameControll.showRichText(nodeName, showText);
        } else if (showType == "aboveHead") {

        }

    },

    // 角色移动类，第一个参数为需要移动到的节点名，第二个参数为停留在该节点的什么方位，第三个参数为停留时人物的朝向
    nodeMoveToObjectFunc: function () {

    },

    // 角色移动类，参数为x，y坐标
    nodeMoveToFunc: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
