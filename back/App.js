require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 3001;
const app = express();
var session = require('express-session');
const e = require('express');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Establecer en true si estás en https
}));

const allowedOrigins = [
  process.env.PORTATIL_CLASE,
  process.env.CASA,
  process.env.CLASE_ORDENADOR,
  process.env.LOCALHOST,
  process.env.CASA_LILIAN,
  process.env.CASA_PORTATIL
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
};

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

app.use(cors(corsOptions));
app.use(express.json());

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar con la base de datos");
  }
};

app.get("/", async (req, res) => {
  res.json({ message: "CENTRE\nINTENACIONAL D'EDUCACIÓ" });
});

app.get("/logReg", (req, res) => {
  res.json({
    login: "Iniciar Sesión",
    register: "Registrarse"
  });
});

app.get("/login", async (req, res) => {
  res.json({ message: "Login page" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM userApp WHERE usuario = ? AND contraseña = ?", [username, password]);
    if (rows.length > 0) {
      req.session.userId = rows[0].id;
      res.status(200).json({ message: "Inicio de sesión exitoso", loggedIn: true });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas", loggedIn: false });
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor", loggedIn: false });
  }
});

app.get("/loginCheck", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, user: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/register", (req, res) => {
  res.json({ message: "Register page" });
});

app.post("/register", async (req, res) => {
  const { username, password, names, surnames, address, birthDate, dni, grade, pastGrade, seguro, cuotaCide, familiaNumerosa, contactNames, contactSurnames, contactDni, contactEmail, IBAN } = req.body;

  const namesSplit = names.split(" ");
  const surnameSplit = surnames.split(" ");
  const contactNamesSplit = contactNames.split(" ");
  const contactSurnameSplit = contactSurnames.split(" ");

  try {
    const connection = await getConnection();

    const [rowsContactDni] = await connection.execute("SELECT COUNT(*) as count FROM estudiantes WHERE dni_contacto = ?", [contactDni]);
    const isFamiliaNumerosa = rowsContactDni[0].count >= 3;

    if (familiaNumerosa && !isFamiliaNumerosa) {
      return res.status(400).json({ message: "No es una familia numerosa" });
    }

    await connection.query(
      "INSERT INTO userApp (usuario, contraseña) VALUES (?, ?)", [username, password]
    );

    await connection.query(
      "INSERT INTO contacto (nombr1, nombre2, apellido1, apellido2, dni, email) VALUES (?, ?, ?, ?, ?, ?)",
      [contactNamesSplit[0], contactNamesSplit[1], contactSurnameSplit[0], contactSurnameSplit[1], contactDni, contactEmail]
    );

    const [rowsUserApp] = await connection.execute("SELECT id FROM userApp WHERE usuario = ? AND contraseña = ?", [username, password]);
    if (rowsUserApp.length > 0) {
      const userId = rowsUserApp[0].id;

      const [resultStudent] = await connection.query(
        "INSERT INTO estudiantes (nombr1, nombre2, apellido1, apellido2, dirreccion, fecha_nacimiento, dni, curso, centro_anterior, iban, dni_contacto, id_user, familia_numerosa, seguro, cuota_cide) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [namesSplit[0], namesSplit[1], surnameSplit[0], surnameSplit[1], address, birthDate, dni, grade, pastGrade, IBAN, contactDni, userId, isFamiliaNumerosa, seguro, cuotaCide]
      );

      const studentId = resultStudent.insertId;

      await connection.query(
        "INSERT INTO curso_escolar (nombre_curso, estudiante_nif) VALUES (?, ?)", [grade, dni]
      );

      const [result] = await connection.execute("INSERT INTO facturas (fecha_creacion, estado, id_user, tipo_factura, precio) VALUES (CURDATE(), ?, ?, ?)",
        ['pendiente', userId, "estudiante", 73]);
      const facturaId = result.insertId;

      await connection.execute("INSERT INTO factura_estudiante (id_factura, id_estudiante) VALUES (?, ?, ?)",
        [facturaId, studentId]);

      res.status(200).json({ message: "Datos registrados correctamente" });
    } else {
      res.status(401).json({ message: "No encontrado" });
    }
  } catch (error) {
    console.error("Error en el registro de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/restartPassw", (req, res) => {
  res.json({
    newContaseña: "Nueva Contraseña:",
    repitNewContaseña: "Repite Contraseña:"
  });
});

app.post("/restartPassw", async (req, res) => {
  const { userText, passText, repitPassText } = req.body;
  const connection = await getConnection();

  if (passText === repitPassText) {
    const [rows] = await connection.execute("SELECT * FROM userApp WHERE usuario = ?", [userText]);

    if (rows.length > 0) {
      await connection.execute("UPDATE userApp SET contraseña = ? WHERE usuario = ?", [passText, userText]);
      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } else {
      res.status(401).json({ message: "Usuario no encontrado" });
    }
  } else {
    res.status(401).json({ message: "Las contraseñas no coinciden" });
  }

});

app.get("/menuPage", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;
    const [rowsContactName] = await connection.execute(
      `
      SELECT contacto.nombr1, contacto.apellido1
      FROM estudiantes
      INNER JOIN contacto ON estudiantes.dni_contacto = contacto.dni
      WHERE estudiantes.id_user = ?
    `,
      [userId]
    );
    if (rowsContactName.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, contactName: rowsContactName[0] });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el contacto" });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ logout: false });
    }

    res.clearCookie('sid');
    res.json({ logout: true });
  });
});

app.get("/materialPage", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;
    const [rows] = await connection.execute("SELECT * FROM productos");

    // Obtiene la cantidad de productos en el carrito
    const [cartRows] = await connection.execute(`
          SELECT COUNT(*) as count 
          FROM carrito_productos 
          WHERE id_usuario = ? AND estado = 'pendiente'
      `, [userId]);
    const cartCount = cartRows[0].count;

    if (rows.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, products: rows, cartCount });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el producto", cartCount });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/materialPage", async (req, res) => {
  const connection = await getConnection();
  if (req.session.userId) {
    const userId = req.session.userId;
    const product = req.body;

    console.log(product);

    const [rows] = await connection.execute(
      "SELECT * FROM carrito_productos WHERE id_usuario = ? AND id_producto = ? AND estado = 'pendiente'",
      [userId, product.id]
    );

    if (rows.length > 0) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      await connection.execute(
        "UPDATE carrito_productos SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_producto = ? AND estado = 'pendiente'",
        [1, userId, product.id]
      );
    } else {
      // Si el producto no está en el carrito, añadir un nuevo registro
      await connection.execute(
        "INSERT INTO carrito_productos (id_usuario, id_producto, estado, cantidad) VALUES (?, ?, 'pendiente', 1)",
        [userId, product.id]
      );
    }

    // Obtener la cantidad total de todos los productos en el carrito
    const [totalRows] = await connection.execute(
      "SELECT SUM(cantidad) as total FROM carrito_productos WHERE id_usuario = ? AND estado = 'pendiente'",
      [userId]
    );
    const totalCantidad = totalRows[0].total;

    console.log("Producto agregado al carrito", product.id);
    res.status(200).json({ message: "Producto agregado al carrito", cartCount: totalCantidad });

  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/serviciosPage", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;
    const [rows] = await connection.execute("SELECT * FROM extraescolares");

    // Obtiene la cantidad de productos en el carrito
    const [cartRows] = await connection.execute(`
          SELECT COUNT(*) as count 
          FROM carrito_extraescolares 
          WHERE id_usuario = ? AND estado = 'pendiente'
      `, [userId]);
    const cartCount = cartRows[0].count;

    if (rows.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, servicios: rows, cartCount });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el producto", cartCount });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/serviciosPage", async (req, res) => {
  const connection = await getConnection();
  if (req.session.userId) {
    const userId = req.session.userId;
    const servicio = req.body;

    console.log(servicio);

    // Comprobar si el producto ya está en el carrito
    const [rows] = await connection.execute(
      "SELECT * FROM carrito_extraescolares WHERE id_usuario = ? AND id_extraescolares = ? AND estado = 'pendiente'",
      [userId, servicio.id]
    );

    if (rows.length > 0) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      await connection.execute(
        "UPDATE carrito_extraescolares SET cantidad = cantidad + ? WHERE id_usuario = ? AND id_extraescolares = ? AND estado = 'pendiente'",
        [1, userId, servicio.id]
      );
    } else {
      // Si el producto no está en el carrito, añadir un nuevo registro
      await connection.execute(
        "INSERT INTO carrito_extraescolares (id_usuario, id_extraescolares, estado, cantidad) VALUES (?, ?, 'pendiente', 1)",
        [userId, servicio.id]
      );
    }

    // Obtener la cantidad total de todos los productos en el carrito
    const [totalRows] = await connection.execute(
      "SELECT SUM(cantidad) as total FROM carrito_extraescolares WHERE id_usuario = ? AND estado = 'pendiente'",
      [userId]
    );
    const totalCantidad = totalRows[0].total;

    console.log("Producto agregado al carrito", servicio.i);
    res.status(200).json({ message: "Producto agregado al carrito", cartCount: totalCantidad });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/carrito", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;
    const [rows] = await connection.execute(`
          SELECT productos.*, carrito_productos.cantidad
          FROM productos 
          INNER JOIN carrito_productos 
          ON productos.id = carrito_productos.id_producto 
          WHERE carrito_productos.id_usuario = ? AND carrito_productos.estado = 'pendiente'
      `, [userId]);

    // Obtiene el total de todos los productos en el carrito
    const [totalRows] = await connection.execute(`
          SELECT SUM(productos.precio) as total 
          FROM productos 
          INNER JOIN carrito_productos 
          ON productos.id = carrito_productos.id_producto 
          WHERE carrito_productos.id_usuario = ? AND carrito_productos.estado = 'pendiente'
      `, [userId]);
    const total = totalRows[0].total;

    if (rows.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, products: rows, total });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el producto", total });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/carritoServ", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;
    const [rows] = await connection.execute(`
          SELECT extraescolares.*, carrito_extraescolares.cantidad 
          FROM extraescolares 
          INNER JOIN carrito_extraescolares 
          ON extraescolares.id = carrito_extraescolares.id_extraescolares 
          WHERE carrito_extraescolares.id_usuario = ? AND carrito_extraescolares.estado = 'pendiente'
      `, [userId]);

    // Obtiene el total de todos los productos en el carrito
    const [totalRows] = await connection.execute(`
          SELECT SUM(extraescolares.precio * carrito_extraescolares.cantidad) as total 
          FROM extraescolares 
          INNER JOIN carrito_extraescolares
          ON extraescolares.id = carrito_extraescolares.id_extraescolares
          WHERE carrito_extraescolares.id_usuario = ? AND carrito_extraescolares.estado = 'pendiente'
      `, [userId]);
    const total = totalRows[0].total;

    if (rows.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, servicios: rows, total });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el producto", total });
    }
  } else {
    res.json({ loggedIn: false });
  }
});


app.get("/perfilPage", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;

    const [rowsContactName] = await connection.execute(
      `
        SELECT contacto.*
        FROM estudiantes
        INNER JOIN contacto ON estudiantes.dni_contacto = contacto.dni
        WHERE estudiantes.id_user = ?
      `,
      [userId]
    );

    if (rowsContactName.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, contacto: rowsContactName[0] });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el contacto", cartCount });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/addStudent", async (req, res) => {
  const connection = await getConnection();
  const { names, surnames, address, birthDate, dni, grade, pastGrade, seguro, cuotaCide, familiaNumerosa } = req.body;

  const namesSplit = names.split(" ");
  const surnameSplit = surnames.split(" ");

  if (req.session.userId) {
    const userId = req.session.userId;

    const [rowStudent] = await connection.execute("SELECT * FROM estudiantes WHERE id_user = ?", [userId]);
    const IBAN = rowStudent[0].iban;
    const contactDni = rowStudent[0].dni_contacto;

    const [rowsContactDni] = await connection.execute("SELECT COUNT(*) as count FROM estudiantes WHERE dni_contacto = ?", [contactDni]);
    const isFamiliaNumerosa = rowsContactDni[0].count >= 2;
    if (familiaNumerosa && !isFamiliaNumerosa) {
      return res.status(400).json({ message: "No es una familia numerosa" });
    }
    const [resultStudent] = await connection.query(
      "INSERT INTO estudiantes (nombr1, nombre2, apellido1, apellido2, dirreccion, fecha_nacimiento, dni, curso, centro_anterior, iban, dni_contacto, id_user, familia_numerosa, seguro, cuota_cide) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [namesSplit[0], namesSplit[1], surnameSplit[0], surnameSplit[1], address, birthDate, dni, grade, pastGrade, IBAN, contactDni, userId, familiaNumerosa, seguro, cuotaCide]
    );

    const studentId = resultStudent.insertId;

    await connection.query(
      "UPDATE estudiantes SET familia_numerosa = ? WHERE dni_contacto = ?", [familiaNumerosa, contactDni]
    )

    await connection.query(
      "INSERT INTO curso_escolar (nombre_curso, estudiante_nif) VALUES (?, ?)", [grade, dni]
    );

    const [result] = await connection.execute("INSERT INTO facturas (fecha_creacion, estado, id_user, tipo_factura, precio) VALUES (CURDATE(), ?, ?, ?)",
      ['pendiente', userId, "estudiante", 73]);
    const facturaId = result.insertId;

    await connection.execute("INSERT INTO factura_estudiante (id_factura, id_estudiante) VALUES (?, ?, ?)",
      [facturaId, studentId]);

    console.log("Datos registrados correctamente");
    res.status(200).json({ message: "Datos registrados correctamente" });
  }
});

app.post("/payServicios", async (req, res) => {
  if (req.session.userId) {
    const connection = await getConnection();
    const userId = req.session.userId;

    const [rowsContactDni] = await connection.execute("SELECT COUNT(*) as count FROM estudiantes WHERE id_user = ?", [userId]);
    const isFamiliaNumerosa = rowsContactDni[0].count >= 2;

    const [totalRows] = await connection.execute(`
          SELECT SUM(extraescolares.precio * carrito_extraescolares.cantidad) as total 
          FROM extraescolares 
          INNER JOIN carrito_extraescolares
          ON extraescolares.id = carrito_extraescolares.id_extraescolares
          WHERE carrito_extraescolares.id_usuario = ? AND carrito_extraescolares.estado = 'pendiente'
      `, [userId]);
    const total = totalRows[0].total;


    if (isFamiliaNumerosa) {
      const totalDescuento = total - (total * 0.2);

      const [resultInsert] = await connection.execute("INSERT INTO facturas (fecha_creacion, estado, id_user, tipo_factura, precio) VALUES (CURDATE(), ?, ?, ?, ?)",
        ['pendiente', userId, "material", totalDescuento]);

      const facturaId = resultInsert.insertId;

      const [rowsServ] = await connection.execute("SELECT * FROM carrito_extraescolares WHERE id_usuario = ? AND estado = 'pendiente'", [userId]);

      for (let i = 0; i < rowsServ.length; i++) {
        const servicio = rowsServ[i];

        // Disminuir la cantidad de plazas disponibles en el servicio
        await connection.execute(
          "UPDATE extraescolares SET plazas = plazas - ? WHERE id = ?",
          [servicio.cantidad ,servicio.id_extraescolares]
        );

        // Marcar el servicio como completado para el usuario
        await connection.execute(
          "UPDATE carrito_extraescolares SET estado = 'completado' WHERE id_carrito = ? AND id_usuario = ?",
          [servicio.id_carrito, userId]
        );

        // Insertar el servicio en la tabla factura_extraescolares
        await connection.execute("INSERT INTO factura_extraescolares (id_factura, id_extraescolares, cantidad) VALUES (?, ?, ?)",
          [facturaId, servicio.id_extraescolares, servicio.cantidad]);
      }
    } else {
      // Crear la factura antes del bucle
      const [result] = await connection.execute("INSERT INTO facturas (fecha_creacion, estado, id_user, tipo_factura, precio) VALUES (CURDATE(), ?, ?, ?, ?)",
        ['pendiente', userId, "extraescolar", total]);

      const facturaId = result.insertId;

      const [rowsServ] = await connection.execute("SELECT * FROM carrito_extraescolares WHERE id_usuario = ? AND estado = 'pendiente'", [userId]);

      for (let i = 0; i < rowsServ.length; i++) {
        const servicio = rowsServ[i];

        // Disminuir la cantidad de plazas disponibles en el servicio
        await connection.execute(
          "UPDATE extraescolares SET plazas = plazas - ? WHERE id = ?",
          [servicio.cantidad ,servicio.id_extraescolares]
        );

        // Marcar el servicio como completado para el usuario
        await connection.execute(
          "UPDATE carrito_extraescolares SET estado = 'completado' WHERE id_carrito = ? AND id_usuario = ?",
          [servicio.id_carrito, userId]
        );

        // Insertar el servicio en la tabla factura_extraescolares
        await connection.execute("INSERT INTO factura_extraescolares (id_factura, id_extraescolares, cantidad) VALUES (?, ?, ?)",
          [facturaId, servicio.id_extraescolares, servicio.cantidad]);
      }
    }

    res.status(200).json({ loggedIn: true, user: req.session.userId, message: "Pago realizado correctamente y carrito limpio" });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/payMaterial", async (req, res) => {
  if (req.session.userId) {
    const connection = await getConnection();
    const userId = req.session.userId;

    const [result] = await connection.execute("INSERT INTO facturas (fecha_creacion, estado, id_user, tipo_factura) VALUES (CURDATE(), ?, ?, ?)",
      ['pendiente', userId, "material"]);

    const facturaId = result.insertId;

    const [rowsProd] = await connection.execute("SELECT * FROM carrito_productos WHERE id_usuario = ? AND estado = 'pendiente'", [userId]);

    for (let i = 0; i < rowsProd.length; i++) {
      const producto = rowsProd[i];

      // Disminuir la cantidad de plazas disponibles en el servicio
      await connection.execute(
        "UPDATE productos SET stock = stock - 1 WHERE id = ?",
        [producto.id_producto]
      );

      // Marcar el servicio como completado para el usuario
      await connection.execute(
        "UPDATE carrito_productos SET estado = 'completado' WHERE id_carrito = ?",
        [producto.id_carrito]
      );

      await connection.execute("INSERT INTO factura_producto (id_factura, id_producto, cantidad) VALUES (?, ?, ?)",
        [facturaId, producto.id_producto, producto.cantidad]);

    }
    res.status(200).json({ loggedIn: true, user: req.session.userId, message: "Pago realizado correctamente y carrito limpio" });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/facturas", async (req, res) => {
  if (req.session.userId) {
    const connection = await getConnection();
    const userId = req.session.userId;

    const [rows] = await connection.execute("SELECT * FROM facturas WHERE id_user = ?", [userId]);

    if (rows.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, facturas: rows });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró la factura" });
    }
  }
});

app.get("/facturasAdmin", async (req, res) => {
  if (req.session.userId) {
    const connection = await getConnection();
    const userId = req.session.userId;

    const [rows] = await connection.execute("SELECT * FROM facturas WHERE estado = ?", ["pendiente"]);

    if (rows.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, facturas: rows });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró la factura" });
    }
  }
});

app.post("/facturasAdmin", async (req, res) => {
  if (req.session.userId) {
    const connection = await getConnection();
    const userId = req.session.userId;
    const { facturaId, estado } = req.body;

    try {
      if (estado) {
        const [result] = await connection.execute(`
        UPDATE facturas 
        SET estado = ? 
        WHERE id = ?
      `, ["completado", facturaId]);

        if (result.affectedRows > 0) {
          res.status(200).json({ success: true, message: 'Factura actualizada correctamente.' });
        } else {
          res.status(404).json({ success: false, message: 'Factura no encontrada o no pertenece al usuario.' });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.get("/studentPage", async (req, res) => {
  const connection = await getConnection();

  if (req.session.userId) {
    const userId = req.session.userId;

    const [studentsRow] = await connection.execute(
      `
        SELECT * FROM estudiantes
      `,
    );

    if (studentsRow.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, students: studentsRow[0] });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el contacto", cartCount });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/studentPage", async (req, res) => {
  const connection = await getConnection();
  const dni = req.body.dni;

  if (req.session.userId) {
    const userId = req.session.userId;
    const [studentsRow] = await connection.execute(
      `
        SELECT * FROM estudiantes where dni = ?
      `,
      [dni]
    );

    if (studentsRow.length > 0) {
      res.status(200).json({ loggedIn: true, user: req.session.userId, students: studentsRow[0] });
    } else {
      res.status(200).json({ loggedIn: true, user: req.session.userId, message: "No se encontró el contacto", cartCount });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
