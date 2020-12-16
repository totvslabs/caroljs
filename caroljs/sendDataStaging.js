var async = require("async");

var utils = require("./utils.js");
var carol = require("./carol");
var pass = require("./passwords.js");
var figlet = require('figlet');

var domain = process.argv[2];
var connectorParam = process.argv[3];
var cds = utils.hasParameter('cds');

if(domain == undefined || domain.length == 0) {
    console.info("please, specify a tenant name.");
    console.info("Usage: ");
    console.info('node sendDataStaging.js tenantName connectorName');
}
else {
    domain = domain.toLowerCase();

    figlet(domain, function(err, asciiArt) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
        }

        var tenantObject = pass.envs.search({tenantName: domain}).uniqueInstance();

        if(tenantObject != undefined) {
            carol.authentication(tenantObject.tenantName, tenantObject.username, tenantObject.password, function(accessToken) {
                console.info("accessToken: " + accessToken);
                var stagingTableName = 'customer';

                carol.getConnectorByName(domain, accessToken, connectorParam, function(connector) {
                    if(connector != undefined && connector["mdmId"] != undefined) {
                        var connectorId = connector["mdmId"];
                        console.info("connectorID: " + connectorId);

                        sendData(domain, accessToken, connectorId, stagingTableName);
                    }
                    else {
                        carol.postConnector(domain, accessToken, connectorParam, connectorParam, function(connector) {
                            connectorId = connector["mdmId"];
                            console.info("connectorID: " + connectorId);
                            sendData(domain, accessToken, connectorId, stagingTableName);
                        });
                    }
                });
            }); 
        }
        else {
            console.info("Tenant not found in your internal library!");
            console.info();
        }
    });
}

function sendData(domain, accessToken, connectorId, stagingTableName) {
    console.info("ready to send data: " + connectorId);
    var data = JSON.stringify([{"name": "teste"}]);
    var stagingTableSchema = '{"mdmCrosswalkTemplate":{"mdmCrossreference":{"customer":["code"]}},"mdmExportData":"false","mdmFlexible":"true","mdmStagingMapping":{"properties":{"code":{"type":"string"},"name":{"type":"string"}}}}';

    carol.getStagingSchema(domain, accessToken, connectorId, stagingTableName, function(schema) {
        if(schema != undefined && schema["errorCode" != 404]) {
            console.info("Schema exists, going to send data.");

            carol.sendData(domain, accessToken, connectorId, stagingTableName, data,  function(result) {
                console.info("Data is OK.");
                console.info();
                console.info();
            }, intake=cds);
        }
        else {
            console.info("Schema doesn't exist, going to create it.");
            carol.setStagingSchema(domain, accessToken, connectorId, stagingTableName, stagingTableSchema, function(done) {
                console.info("Schema created.");

                carol.sendData(domain, accessToken, connectorId, stagingTableName, data,  function(result) {
                    console.info("Data is OK.");
                    console.info();
                    console.info();
                }, intake=cds);
            });
        }
    });
}