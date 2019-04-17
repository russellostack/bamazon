drop database if exists bamazon_db;
create database bamazon_db;
use bamazon_db;

create table products (
item_id int not null auto_increment,
product_name varchar(255) not null,
department_name varchar(255) not null,
price decimal(10,2),
stock_quantity int(11),
primary key(item_id)
);