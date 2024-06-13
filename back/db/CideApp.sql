drop database CideApp;

Create database CideApp;
use CideApp;



Create table userApp (
id int primary key auto_increment,
usuario varchar(20) unique,
contraseña varchar(16)
);
insert into userApp (usuario, contraseña) values ("admin", "admin");
select * from userApp;

Create table contacto (
id int primary key auto_increment,
nombr1 varchar(50) not null,
nombre2 varchar(50),
apellido1 varchar(50) not null,
apellido2 varchar(50),
dni varchar(9) not null unique,
email varchar(100) not null
);

Create table estudiantes (
id int primary key auto_increment,
nombr1 varchar(50) not null,
nombre2 varchar(50),
apellido1 varchar(50) not null,
apellido2 varchar(50),
dirreccion varchar(100) not null,
fecha_nacimiento varchar(20) not null,
dni varchar(9) not null unique,
curso varchar(100) not null,
centro_anterior varchar(100),
iban varchar(30),
dni_contacto varchar(10),
foreign key (dni_contacto) references contacto(dni),
id_user int,
foreign key (id_user) references userApp(id),
seguro boolean default true,
cuota_cide boolean default true,
familia_numerosa boolean default false
);

Create table curso_escolar (
id int primary key auto_increment,
nombre_curso varchar(100) not null,
estudiante_nif varchar(20) not null unique,
foreign key (estudiante_nif) references estudiantes(dni)
);

Create table facturas (
id int primary key auto_increment,
fecha_creacion date,
estado varchar(20) default "pendiente", 
id_user int,
tipo_factura varchar(100),
precio DECIMAL(10, 2),
foreign key (id_user) references userApp(id)
);
Create table productos (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100),
descripcion TEXT,
imagen_producto VARCHAR(100),
precio DECIMAL(10, 2),
stock INT,
disponible BOOLEAN DEFAULT TRUE
);

INSERT INTO productos (nombre, descripcion, imagen_producto, precio, stock, disponible) VALUES
('Cuaderno A4', 'Cuaderno de tamaño A4 con 100 hojas, ideal para tomar notas en clase.', "..assets/cuaderno.png", 2.50, 50, TRUE),
('Lápiz HB', 'Lápiz de grafito HB, perfecto para escritura y dibujo.', "..assets/lapiz.png", 0.50, 200, TRUE),
('Bolígrafo Azul', 'Bolígrafo de tinta azul con punta de 0.7 mm.', "..assets/boli.png", 0.75, 150, TRUE),
('Mochila Escolar', 'Mochila resistente con varios compartimentos, disponible en varios colores.', "..assets/mochila.png", 25.00, 30, TRUE),
('Goma de Borrar', 'Goma de borrar blanca, no deja residuos y es ideal para borrar lápiz.', "..assets/goma.png", 0.30, 300, TRUE),
('Tijeras Escolares', 'Tijeras con punta redondeada, seguras para niños y de fácil manejo.', "..assets/tijeras.png", 1.50, 100, TRUE),
('Regla 30 cm', 'Regla de 30 cm de plástico transparente, con medidas en centímetros y pulgadas.', "..assets/regla.png", 1.00, 120, TRUE),
('Estuche', 'Estuche escolar con cremallera, disponible en varios diseños.', "..assets/estuche.png", 5.00, 80, TRUE),
('Colores', 'Set de 12 colores de madera, perfectos para colorear y dibujar.', "..assets/colores.png", 3.00, 60, TRUE),
('Pegamento en Barra', 'Pegamento en barra de 21g, ideal para manualidades y trabajos escolares.', "..assets/pegamento.png", 0.80, 90, TRUE);


CREATE TABLE carrito_productos (
id_carrito INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT,
id_producto INT,
estado VARCHAR(100),
cantidad int,
FOREIGN KEY (id_producto) REFERENCES productos(id),
FOREIGN KEY (id_usuario) REFERENCES userApp(id)
);

CREATE TABLE carrito_extraescolares (
id_carrito INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT,
id_extraescolares INT,
estado VARCHAR(100),
cantidad int,
FOREIGN KEY (id_extraescolares) REFERENCES extraescolares(id),
FOREIGN KEY (id_usuario) REFERENCES userApp(id)
);

CREATE TABLE extraescolares (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100),
descripcion TEXT,
precio DECIMAL(10, 2),
plazas int
);
create table factura_extraescolares (
id_factura_extraescolares int primary key auto_increment,
id_factura int,
id_extraescolares int,
cantidad int,
foreign key (id_factura) references facturas(id),
foreign key (id_extraescolares) references extraescolares(id)
);
create table factura_producto (
id_factura_producto int primary key auto_increment,
id_factura int,
id_producto int,
cantidad int,
foreign key (id_factura) references facturas(id),
foreign key (id_producto) references productos(id)
);

create table factura_estudiante (
id_factura_estudiante int primary key auto_increment,
id_factura int,
id_estudiante int,
foreign key (id_factura) references facturas(id),
foreign key (id_estudiante) references estudiantes(id)
);

ALTER TABLE extraescolares ADD COLUMN precio_diario DECIMAL(10, 2) NULL;
INSERT INTO extraescolares (nombre, descripcion, precio, plazas, precio_diario) VALUES 
('Master Xef', 'Clase de cocina para niños', 30.00, 20, NULL),
('Arduino', 'Introducción a la programación y robótica con Arduino', 25.00, 15, NULL),
('Gimnàsia', 'Actividades de gimnasia para mejorar la condición física', 20.00, 25, NULL),
('Fútbol', 'Entrenamiento y partidos de fútbol', 25.00, 30, NULL),
('Bàsquet', 'Entrenamiento y partidos de baloncesto', 25.00, 30, NULL),
('Anglès amb jocs', 'Clases de inglés a través de juegos y actividades', 25.00, 20, NULL),
('Robòtica', 'Curso avanzado de robótica', 35.00, 10, NULL),
('Escola Matinera', 'Servicio de guardería matutina', 90.00, 50, 5.00),
('Menjador', 'Servicio de comedor escolar', 150.00, 100, 8.50);
