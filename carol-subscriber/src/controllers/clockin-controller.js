const async = require('async');
const Postgres = require('../services/postgres-service');
require('dotenv').config();

module.exports = {
    list: async (req, res) => {
        const pool = Postgres.getPool();

        let query = `SELECT * FROM messages_sub m WHERE 1 = 1`;

        if (req.query.mdmid) {
            query += ` AND m.mdmid = '${req.query.mdmid}'`;
        }

        if (req.query.messageid) {
            query += ` AND m.messageid = '${req.query.messageid}'`;
        }

        query += ' ORDER BY m.datetimemessage';

        try {
            pool.query(query, (err, dbResponse) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json(dbResponse.rows);
                }
            });
        } catch {
            pool.end();
        }
    },
    message: async (req, res) => {
       const pool = Postgres.getPool();

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
