const async = require('async');
const Postgres = require('../services/postgres-service');
require('dotenv').config();

module.exports = {
    list: async (req, res) => {
        const pool = Postgres.getPool();

        let query = `SELECT * FROM messages_sub m WHERE 1 = 1`;
        const values = [];

        if (req.query.type) {
            values.push(req.query.type);
            query += ` AND m.type = $'${values.length}'`;
        }
        
        if (req.query.mdmid) {
            values.push(req.query.mdmid);
            query += ` AND m.mdmid = $'${values.length}'`;
        }

        if (req.query.messageid) {
            values.push(req.query.messageid);
            query += ` AND m.messageid = $'${values.length}'`;
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
        //Examples
        //  EMPTY
        //      curl -X POST -H "Content-Type: application/json" http://localhost:8001/api
        //  GENERIC
        //      curl -X POST -H "Content-Type: application/json" -d '{"content":"message"}' http://localhost:8001/api?type=demo
        //  SUBSCRIPTION
        //      curl -X POST -H "Content-Type: application/json" -d '{"records":[{"mdmId":"aaa","mdmGoldenFieldAndValues":{"devicecode":"devicecode","nsrcode":"nsrcode"}}],"messageId":"12345","subscriptionName":"demo-name"}' http://localhost:8001/api?type=subscription

        const requestType = req.query.type;
        const body = req.body;

        if (!body || !Object.keys(body).length) {
            console.info(`Request(${requestType}): 204 empty body`);

            return res.status(204).json({
                type: requestType,
            });
        }

        const pool = Postgres.getPool();
        const datetimemessage = new Date().toISOString();
        const sqlInsertFn = (sqlStatement, sqlValues) => {
            console.info('sql statement: ', sqlStatement);
            console.info('sql values: ', sqlValues);

            pool.query(sqlStatement, sqlValues, (err, res) => {
                if (res != undefined) {
                    console.info(`Records affected: ${res['rowCount']}`);
                    if (err != undefined) {
                        console.log(err)
                    }
                } else {
                    console.info(`Response undefined: ${res} :::::: $$` + JSON.stringify(sqlValues) + '$$' + JSON.stringify(err));
                }
            });
        };

        if (body.hasOwnProperty('subscriptionName')) {
            //SAVE SUBSCRIPTION RECORDS
            if (!body['records'] || body['records'] == undefined || body['records'].length <= 0) {
                console.info("ATT: no records sent");
    
                return res.status(200).json({
                    success: true,
                    ack: `true`
                });
            }

            console.info(`message received (${body['messageId']}):::(${body['records'].length}) ` + JSON.stringify(body));
            console.info(`${body['messageId']}\t${body['subscriptionName']}`);

            const arr = body['records'];

            async.eachSeries(arr, function (record, callbackRecords) {
                const rawJson = JSON.stringify(record).replace(/[\/\(\)\']/g, "&apos;")
                const sqlStatement = `
                    INSERT INTO messages_sub(type, subscriptionname, messageid, mdmid, json, datetimemessage)
                    VALUES($1, $2, $3, $4, $5, $6)
                `;
                const sqlValues = [
                    requestType,
                    body['subscriptionName'],
                    body['messageId'],
                    record['mdmId'],
                    rawJson,
                    datetimemessage,
                ];

                sqlInsertFn(sqlStatement, sqlValues);
                callbackRecords();

                if (record.hasOwnProperty('mdmGoldenFieldAndValues')) {
                    console.info(`\t\t${record['mdmGoldenFieldAndValues']['devicecode']}\t${record['mdmGoldenFieldAndValues']['nsrcode']}\t${record['mdmGoldenFieldAndValues']['mdmeventdate']}`);
                }
            }, function () {
                pool.end();

                console.info("ATT: records processed (" + body['messageId'] + "): " + arr.length);

                return res.status(200).json({
                    success: true,
                    ack: `true`
                });
            });
        } else {
            //SALVE RAW DATA
            const rawJson = JSON.stringify(body).replace(/[\/\(\)\']/g, "&apos;")
            const sqlStatement = `
                INSERT INTO messages_sub(type, json, datetimemessage)
                VALUES($1, $2, $3)
            `;
            const sqlValues = [
                requestType,
                rawJson,
                datetimemessage,
            ];

            sqlInsertFn(sqlStatement, sqlValues);
            pool.end();

            return res.status(200).json({
                success: true,
                ack: 'true',
                type: requestType,
            });
        }
    },
};