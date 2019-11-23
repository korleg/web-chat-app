const redis = require('redis');
const shortid = require('short-id');
const redisClient = require('../redisClient');
const _ = require('lodash');
function Messages() {
    this.client = redisClient.getClient();
};

module.exports = new Messages();


Messages.prototype.upsert = function({ roomId, message, username, surname, userId }) {
    this.client.hset(
        'messages:' + roomId,
        shortid.generate(),
        JSON.stringify({
            userId,
            username,
            surname,
            message,
            when: Date.now()
        }),
        err => {
            if (err) {
                console.error(err)
            }
        }
    )
};

Messages.prototype.list = function (roomId, callback) {
    let messageList = [];

    this.client.hgetall('messages:'+roomId, (err, messages) => {
        if (err) {
            console.error(err);
            return callback([])
        }
        for(let message in messages){
            messageList.push(JSON.parse(messages[message]))
        }

        return callback(_.orderBy(messageList, 'when', 'asc')); //lodash ile (_) messagelist'i return ettik. burada
    }) //lodash orderBy ile return edeceğimiz şeyi belirler, obje içerisinde hangi bölüm varsa(burada when) ona göre
}       // sıraladık ve asc ile sıralama türünü belirttik