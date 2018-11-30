const express = require('express');
const router = express.Router();
const landingData = require('./landingData');

router.post('/landing-data', (req, res, next) => {
    if (req.headers.authorization !== process.env.APP_TOKEN) {
        res.status(401).json({ error: 'unauthorized' });
    } else {
        res.status(200).json({
            "request": {
                "href": `${req.protocol}://${req.hostname}${req.path}`,
                "userid": `${req.headers.userid}`,
                "token": `${req.headers.authorization}`
            },
            "landingData": [
                {
                    "name": "BadgeBook Messenger",
                    "img-url": ``,
                    "data": [
                        "The modern messenger"
                    ],
                    "link": `${req.protocol}://${req.hostname}`,
                }
            ]
        });
    }
});

module.exports = router;