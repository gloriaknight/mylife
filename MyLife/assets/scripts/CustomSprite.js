cc.Class({
    extends: cc.Component,

    properties: 
    {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () 
    {
        //获取sprite组件
        var sprite = this.node.getComponents(cc.Sprite)[0];

        //游戏风格为像素游戏，所以设置关闭抗锯齿
        sprite.spriteFrame.getTexture().setAliasTexParameters();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
});
