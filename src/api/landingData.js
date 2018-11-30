module.exports = function landingData(req, res, next) {
    console.log(req.headers);
    res.send('whatever');
};