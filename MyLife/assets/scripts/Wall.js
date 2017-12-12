cc.Class({
    extends: cc.Component,

    properties: {
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
    onLoad: function () {
        this.node.group = "Wall"
        var collider = cc.director.getCollisionManager();
        collider.enabled = true;
        collider.enabledDebugDraw = true;
    },

    // 碰撞检测
    onCollisionEnter: function (other, self) {
        console.log("this is Wall collision begin");
        console.log(other);
        console.log(self);
        console.log("this is Wall collision end");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
