var custTools = require('CommonTools');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.storyNodeId = "";
        this.storyScriptLines = [];
    },

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

                console.log(self.storyScriptLines);
            }
        });
    },

    parseStoryScript: function () {
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
