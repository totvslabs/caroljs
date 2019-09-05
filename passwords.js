
var passwd_file = process.env.carol;
var envs = undefined;
var envToPrint = passwd_file;

if(passwd_file == '' || passwd_file == undefined) {
    envToPrint = "production";
}
else {
    passwd_file = 'passwords-' + envToPrint;
}

console.info("Running the command in: " + envToPrint);

if(passwd_file != undefined && passwd_file.length > 0) {
    envs = require('./' + passwd_file).envs;
}
else {
    envs = [
        {
            tenantName: "admin",
            username: "admin@totvs.com",
            password: "passwordHere",
            globalAdmin: true
        },
        {"tenantName":"carolws100","username":"robson.poffo@totvs.com","password":"senha@123"}
    ];
}

exports.envs = envs;
