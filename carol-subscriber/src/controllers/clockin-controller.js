const { Pool, Client } = require('pg')
const async = require("async");
require('dotenv').config();

module.exports = {
    message: async (req, res) => {
        const pool = new Pool({
            user: process.env.DATABASE_USER || 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            database: process.env.DATABASE_NAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || '',
            port: process.env.DATABASE_PORT || 5432,
        });

        let ordersObj = req.body;
        let now = new Date();
        now = now.toISOString();
        console.info(`message received (${ordersObj['messageId']}):::(${ordersObj['records'].length}) ` + JSON.stringify(ordersObj));

        console.info(`${ordersObj['messageId']}\t${ordersObj['subscriptionName']}`);
        console.info(ordersObj);
        if (ordersObj['records'] != undefined && ordersObj['records'].length > 0) {
            let arr = ordersObj['records'];

            async.eachSeries(arr, function (rec, callbackRecords) {
                let recStr = JSON.stringify(rec).replace(/[\/\(\)\']/g, "&apos;")

                let insertInto = `INSERT INTO messages_sub(subscriptionname, messageid, mdmid, json, datetimemessage) values('${ordersObj['subscriptionName']}',
                '${ordersObj['messageId']}',
                '${rec['mdmId']}',
                '${recStr}',
                '${now}');`;

                console.info('sql: ' + insertInto);

                pool.query(insertInto, (err, res) => {
                    if (res != undefined) {
                        console.info(`Records affected: ${res['rowCount']}`);
                        if (err != undefined) {
                            console.log(err)
                        }
                    }
                    else {
                        console.info(`Response undefined: ${res} :::::: $$` + JSON.stringify(rec) + '$$' + JSON.stringify(err));
                    }

                    callbackRecords();
                });

                console.info(`\t\t${rec['mdmGoldenFieldAndValues']['devicecode']}\t${rec['mdmGoldenFieldAndValues']['nsrcode']}\t${rec['mdmGoldenFieldAndValues']['mdmeventdate']}`);
            }, function () {
                pool.end()

                console.info("ATT: records processed (" + ordersObj['messageId'] + "): " + arr.length);

                return res.status(200).json({
                    success: true,
                    ack: `true`
                });
            });
        }
        else {
            console.info("ATT: no records sent");
            return res.status(200).json({
                success: true,
                ack: `true`
            });
        }
    },

};
