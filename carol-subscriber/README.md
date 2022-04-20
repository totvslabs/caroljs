sudo pm2 start src/carol-sub.js --name carol-sub

```
-- carol.messages_sub definition

-- Drop table

-- DROP TABLE carol.messages_sub;

CREATE TABLE carol.messages_sub (
	subscriptionname varchar NULL,
	messageid varchar NOT NULL,
	mdmid varchar NOT NULL,
	json json NULL,
	datetimemessage timestamp(0) NOT NULL,
	pkk serial NOT NULL,
	tenantid varchar NULL,
	CONSTRAINT messages_sub_pk PRIMARY KEY (pkk)
);
CREATE UNIQUE INDEX messages_sub_pkk_idx ON carol.messages_sub USING btree (pkk);
```
