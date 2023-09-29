sudo pm2 start src/index.js --name qa-webhook

Carol Subscription

```
http://SERVER/api/message

```

Webhook Post Example

```
curl -X POST -H "Content-Type: application/json" -d '{"content":"message"}' http://SERVER/api?type=demo
```

DB DDL

```
-- carol.messages_sub definition

-- Drop table

-- DROP TABLE carol.messages_sub;

CREATE TABLE carol.messages_sub (
	subscriptionname varchar NULL,
	messageid varchar NULL,
	mdmid varchar NULL,
	type varchar NULL,
	json json NULL,
	datetimemessage timestamp(0) NOT NULL,
	pkk serial NOT NULL,
	tenantid varchar NULL,
	CONSTRAINT messages_sub_pk PRIMARY KEY (pkk)
);
CREATE UNIQUE INDEX messages_sub_pkk_idx ON carol.messages_sub USING btree (pkk);
```
