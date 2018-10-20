const redis = require('redis');
const db = redis.createClient();

class Entry{
    constructor(obj){
        for(let key in obj){
            this[key] = obj[key];
        }
    }

    save(callBack){
        const entryJSON = JSON.stringify(this);
        db.lpush("entries", entryJSON, (err) => {
            if(err) return callBack(err);
            callBack();
        });
    }

    static getRange(from, to, callBack){
        db.lrange("entries", from, to, (err, items) => {
            if(err) return callBack(err);
            let entries = [];
            items.forEach((item) => {
                entries.push(JSON.parse(item));
            });

            callBack(null, entries);
        });
    }

    static count(callback){
        db.llen('entries', callback);
    }
}

module.exports = Entry;