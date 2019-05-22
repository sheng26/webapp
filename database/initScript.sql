BEGIN;

DROP SCHEMA IF EXISTS restaurAll;
CREATE SCHEMA restaurAll;
USE restaurAll;

CREATE TABLE menu_categories (
    category_name varchar(50) NOT NULL,
    color varchar(50) NOT NULL,
    PRIMARY KEY (category_name)
);

CREATE TABLE menu_items (
	item_id integer NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	category varchar(50) NOT NULL,
	price decimal(10, 2) NOT NULL,
	FOREIGN KEY (category) REFERENCES menu_categories (category_name),
	PRIMARY KEY (item_id)
);

CREATE TABLE orders (
	order_number integer NOT NULL,
	number_of_items integer,
    total decimal(10, 2),
    completed boolean,
    payed boolean,
	PRIMARY KEY (order_number)
);

CREATE TABLE order_items (
	id varchar(50) NOT NULL,
    order_number integer NOT NULL,
	name varchar(50) NOT NULL,
    crossed boolean,
    price decimal(10, 2) NOT NULL,
    quantity integer NOT NULL,
    FOREIGN KEY (order_number) 
		REFERENCES orders (order_number)
		ON DELETE CASCADE,
	PRIMARY KEY (id)
);

CREATE TABLE calendars (
	c_id integer NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	start_date date NOT NULL,
    selected_intervals text,
    uid integer default 1,
    updated_at timestamp not null default now() on update now(),
	PRIMARY KEY (c_id)
);

CREATE TABLE users (
   username varchar(50) NOT NULL ,
   password varchar(256) NOT NULL,
   salt varchar(50) NOT NULL,
   type varchar(50) NOT NULL,
   PRIMARY KEY (username)
);

create table messages (
	message_id integer NOT NULL AUTO_INCREMENT,
	sender varchar(50) NOT NULL,
    recipient varchar(50) NOT NULL,
    message text NOT NULL,
	created_at timestamp not null default now(),
    PRIMARY KEY (message_id),
	INDEX names_index (sender, recipient)
);

