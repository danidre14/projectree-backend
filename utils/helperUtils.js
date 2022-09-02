const helperUtils = {
    makeString(string = "") {
        try {
            return ("" + string).trim();
        } catch {
            return "";
        }
    },
    isValidUrl(url = "") {
        if (!url) return true;
        try {
            return !!new URL(url);
        } catch {
            return false
        }
    }
}

module.exports = helperUtils;