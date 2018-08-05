#create database bamazon;

use bamazon;

create table products (
item_id int auto_increment,
primary key (item_id),
product_name varchar(50),
department_name varchar(50),
price decimal(2,2) not null,
stock_qty integer not null);