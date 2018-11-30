const log                           = require('log4js').getLogger();
const firebaseConfig                = require('./firebaseConfig');
const firebase                      = require('firebase');
const attachBadgeBookUserToSocket   = require('./serverTokenHandler').attachBadgeBookUserToSocket;

firebase.initializeApp(firebaseConfig);

async function onConnect(socket) {
    log.trace(`A user connected`);

    let messageRef;

    // Do user authentication stuff.
    try {
        await attachBadgeBookUserToSocket(socket);
    } catch (err) {
        log.error(`Error getting badgebook user`, err);
    }

    if (!socket.isValidBadgeBookUser) {
        socket.emit('invalid-user-message', {})
    }



    socket.on('onSelectConversation', (data) => {
        log.trace(`onSelectConversation() - ${data.userId}`);
        let selfId      = socket.badgeBookUserDetails.userId;
        let partnerId   = data.userId;
        let convoId     = concactIds(selfId, partnerId);

        messageRef = firebase.database().ref().child(convoId);

        messageRef.limitToLast(10).on('value', messages => {
            try {
                socket.emit('updateMessageList', Object.values(messages.val()));
            } catch (err) {
                log.trace(`Error converting values`);
                socket.emit('updateMessageList', []);
            }
        });
    });



    socket.on('sendMessage', (messageItem) => {
        try {
            messageItem.userName = socket.badgeBookUserDetails.name
                                 ? socket.badgeBookUserDetails.name
                                 : socket.badgeBookUserDetails.email;
            messageRef.push(messageItem);
        } catch (err) {
            log.error(err);
        }
    });



    socket.on('disconnect', () => {
        log.trace(`user ${socket.badgeBookUserDetails && socket.badgeBookUserDetails.userId} disconnected`)
    });
}

function concactIds(uid, otherid) {
    let result = uid.localeCompare(otherid);
    if (result == 0) {
        return uid;
    } else if (result == 1) {
        return uid.concat(otherid);
    } else {
        return otherid.concat(uid);
    }
}

module.exports = onConnect;