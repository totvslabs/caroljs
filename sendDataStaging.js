var async = require("async");

var utils = require("./utils.js");
var carol = require("./carol");
var pass = require("./passwords.js");
var figlet = require('figlet');

var domain = process.argv[2];

if(domain == undefined || domain.length == 0) {
    console.info("please, specify a tenant name.");
    console.info("Usage: ");
    console.info('node sendDataStaging.js tenantName');
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
                carol.sendData(domain, accessToken, "85ba8de0cfa511e9a81842010a840046", "customer", JSON.stringify([{"name": "teste"}]),  function(result) {
                    console.info("Data is OK.");
                    console.info();
                    console.info();
                });
            }); 
        }
        else {
            console.info("Tenant not found in your internal library!");
            console.info();
        }
    });
}
