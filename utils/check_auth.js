module.exports = {
    check_authentication: function (req, res, next) {
        if(!req.header || !req.headers.authorization){
            throw new Error("ban chua dang nhap")
        }
    },
}