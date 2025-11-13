drop database wine_production;
create database wine_production;
use wine_production;

drop table if exists Update_note;
drop table if exists Is_predicted;
drop table if exists Alerts;
drop table if exists AI_model;
drop table if exists Test_random;
drop table if exists Measure;
drop table if exists Product;
drop table if exists Sensors;
drop table if exists Auditlog;
drop table if exists Batches;
drop table if exists Line;
drop table if exists Warehouse;
drop table if exists Monitor;
drop table if exists Engineer;
drop table if exists Tester;
drop table if exists Users;

create table Users(
	user_id int primary key,
    exp_year int,
    username varchar(50),
    password varchar(50),
    role varchar(50) not null
);

create table Tester(
	user_id int primary key,
	flavor_profile varchar(50),
    foreign key (user_id) references Users(user_id)
);

create table Engineer(
	user_id int primary key,
	expertise varchar(50),
    foreign key (user_id) references Users(user_id)
);

create table Monitor(
	user_id int primary key,
	department_leading varchar(50),
    foreign key (user_id) references Users(user_id)
);

create table Warehouse(
	warehouse_id int primary key, 
    categories varchar(50)
);

create table Line(
	line_id int primary key,
    active_date timestamp default current_timestamp,
    warehouse_id int,
    foreign key (warehouse_id) references Warehouse(warehouse_id)
);

create table Auditlog(
	log_id int primary key,
    time_log timestamp default current_timestamp,
    description varchar(50),
    warehouse_id int,
    engineer_id int,
    foreign key (warehouse_id) references Warehouse(warehouse_id),
    foreign key (engineer_id) references Engineer(user_id)
);

create table Batches(
	batch_id int primary key, 
    quantity int, 
    producted_date timestamp default current_timestamp,
    line_id int,
    foreign key (line_id) references Line(line_id)
);

create table Sensors(
	sensor_id int primary key,
    model varchar(50),
    unit varchar(50),
    line_id int,
    foreign key (line_id) references Line(line_id)
);

create table Product(
	product_id int auto_increment primary key,
    density float,
    chlorides float, 
    alcohol float,
    sulphates float,
    pH float,
    fixed_acidity float, 
    citric_acid float,
    volatile_acidity float,
    free_sulfur_dioxide float,
    total_sulfur_dioxide float,
    residual_sugar float,
    batch_id int,
    foreign key (batch_id) references Batches(batch_id)
);

create table Measure(
	product_id int,
    sensor_id int,
    foreign key (product_id) references Product(product_id),
    foreign key (sensor_id) references Sensors(sensor_id),
    value float
);

create table Test_random(
	score float,
    description varchar(50),
    tester_id int, 
    product_id int, 
    foreign key (tester_id) references Tester(user_id),
    foreign key (product_id) references Product(product_id)
);

create table AI_model(
	model_id int primary key,
    version varchar(50)
);

create table Is_predicted(
	time_predict timestamp default current_timestamp,
    quality_score float,
    confidence varchar(50),
    quality_category varchar(50),
    product_id int,
    AI_model int,
    foreign key (product_id) references Product(product_id),
    foreign key (AI_model) references AI_model(model_id) 
);

create table Update_note(
	update_date timestamp default current_timestamp,
    feature varchar(50),
    AI_model int,
	engineer_id int,
    foreign key (AI_model) references AI_model(model_id),
    foreign key (engineer_id) references Engineer(user_id)
);

create table Alerts (
	alert_id int primary key,
	product_id int, 
    engineer_id int,
    foreign key (product_id) references Product(product_id),
    foreign key (engineer_id) references Engineer(user_id),
    description varchar(50)
);

-- 1. Clean up any existing users to prevent conflicts
DROP USER IF EXISTS 'simulation_user'@'%';
DROP USER IF EXISTS 'simulation_user'@'localhost';
DROP USER IF EXISTS 'dashboard_user'@'localhost';

-- 2. Create the user specifically for LOCALHOST (matches your GRANTs)
CREATE USER 'simulation_user'@'localhost' IDENTIFIED BY 'simulation';

-- 3. Grant permissions (Now this works because the user exists)
GRANT INSERT ON wine_production.Batches TO 'simulation_user'@'localhost';
GRANT INSERT ON wine_production.Product TO 'simulation_user'@'localhost';
GRANT SELECT (batch_id) ON wine_production.Batches TO 'simulation_user'@'localhost';

-- 4. Create Dashboard user
CREATE USER 'dashboard_user'@'localhost' IDENTIFIED BY 'dashboard';
GRANT SELECT ON wine_production.* TO 'dashboard_user'@'localhost';

-- 5. Refresh permissions
FLUSH PRIVILEGES;

-- Verification
-- select * from Product;
-- select * from test_random;
-- select * from is_predicted;
