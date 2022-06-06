create table garment(
	id serial not null primary key,
	description text,
	img text,
	season text,
	gender text,
	price decimal(10,2)
);
create table users(
	id serial not null primary key,
	username text not null,
	password text not null,
	role text
);
create table cart(
	id serial not null primary key,
	item text not null,
	price decimal (10,2),
	user_id int,
	foreign key (user_id) references users(id)
);