function isEmpty(obj) {
    if (obj == null || typeof obj == "undefined" || (typeof obj == "string" && obj.trim() == "")) {
        return true;
    } else {
        return false;
    }
};

var CommonTools = {
    isEmpty: isEmpty,
}

module.exports = CommonTools;

