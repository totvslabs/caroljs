
# Documentation for CarolJS

This is a wrapper to access Carol's endpoint using NodeJS. Feel free to use the tools available and improve it as well.

# Carol Subscription

This is a simple Web Server that expose an URL to allow to consume any data from Carol Subscription. The implementation requires a Postgres database to store all data received.

The expected table follows this specification

```
CREATE TABLE carol.messages_sub (
	subscriptionname varchar NULL,
	messageid varchar NOT NULL,
	mdmid varchar NOT NULL,
	"json" json NULL,
	datetimemessage timestamp(0) NOT NULL,
	pkk serial NOT NULL,
	CONSTRAINT messages_sub_pk PRIMARY KEY (pkk)
);
CREATE UNIQUE INDEX messages_sub_pkk_idx ON carol.messages_sub USING btree (pkk);
```

# Commands available

 Send data to carol (this is a simple sample)
 ---

This command send a simple record to the tenant `carolws100` to the connector `nodejs`. The data will be stored in Carol Data Storage (cds).

```
node sendDataStaging.js carolws100 nodejs cds
```

If you run the bellow command, it will send the record and the same will be visible on real-time layer (no `cds` parameter):

```
node sendDataStaging.js carolws100 nodejs
```



# Passwords

The password is defined on the file `password.js`. There is a file for each environmnet (karol, qarol), and the environment is defined by the system variable `carol`.

Example, you can run commands on explore by:

```
export carol=explore
```

This will consider the file `passwords-explore.js`. The value for the system variable means the password file (`passwords-ENV.js`).


# Dependencies

- Type `npm install` after downloading this project from github. The file `package.json` has all dependencies needed to run the project.
