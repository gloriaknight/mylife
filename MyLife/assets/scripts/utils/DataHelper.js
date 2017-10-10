/**
 * 指定存档槽位创建存档。
 * 1、构建用户存档数据对象
 * 2、清空该存档下缓存
 * 3、将存档数据对象写入缓存中
 * @param {String} slotNum 
 */
function createNewProfile(slotNum) {
    //如果为空，直接返回失败
    if (slotNum == null || typeof slotNum == "undefined" || (typeof slotNum == "string" && slotNum.trim() == "")) {
        return false;
    }

    //组装数据对象
    //TODO : 两种方案，一种使用cc.class创建，一种使用构造函数创建，都是放在DataModel文件夹下

    //清空存档下缓存
    var cacheKey = buildProfileStorageKey(slotNum);
    cc.sys.localStorage.removeItem(cacheKey);

    //将数据对象写入缓存中
};

/**
 * 删除指定存档槽位的缓存
 * @param {String} slotNum 
 */
function deleteProfile(slotNum) {

}

/**
 * 加载指定存档槽位的缓存
 * @param {String} slotNum 
 */
function loadProfile(slotNum) {

}

/**
 * 保存指定存档槽位
 * @param {String} slotNum 
 */
function saveProfile(slotNum) {

}

/**
 * 根据玩家存档槽位构造localStorage中主键
 * @param {String} slotNum 
 */
function buildProfileStorageKey(slotNum) {
    return "UserProfile" + slotNum;
}

var DataHelper = {
    createNewProfile: createNewProfile,
    deleteProfile: deleteProfile,
    loadProfile: loadProfile,
    saveProfile: saveProfile
}

module.exports = DataHelper;