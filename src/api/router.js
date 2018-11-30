const log = require('log4js').getLogger();
const express = require('express');
const router = express.Router();
const landingData = require('./landingData');

router.post('/landing-data', (req, res, next) => {
    if (req.headers.authorization !== process.env.APP_TOKEN) {
        res.status(401).json({ error: 'unauthorized' });
    } else {
        try {
            let responseObj = {
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
            };

            res.status(200).json(responseObj);
        } catch (err) {
            log.error(err);
            res.status(500).json({ error: err.message });
        }
    }
});

module.exports = router;