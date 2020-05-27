// console.log("hola mundo");
var express = require('express');
var app = express();
// 
var dbconex = require('./valencia_conexion_mysql.js');
var mysql = require('mysql');
var _ttoImg = require('./ktto_img.js');
//-------------------------------------------------
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb', extended: true })); //app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); //app.use(bodyParser.urlencoded({ extended: false }));

// carpeta de imagenes: desde donde se levanta el servidor es esta ruta -> /root/trial-server-001/public
app.use("/public", express.static('public'));

// servidor escuchando puerto 3012
var server = app.listen(3012, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Escuchando http en el puerto: %s", port);
});

// dejare el server myssql siempre activo
var conex = mysql.createConnection(dbconex);
conex.connect();
// conex.end();

//-------------------------------------------------
app.post('/usuario',
    function(req, res) {
        // los parametros
        var query = "call sp_usuarios ( '" + req.body.email + "','" + req.body.pssw + "' ) ;";
        //
        console.log(query);
        //
        conex.query({
                sql: query,
                timeout: 2000
            },
            function(er, results) {
                if (er) {
                    console.log('error->', er);
                    res.json({ resultado: 'error' });
                    //throw er; 
                } else {
                    console.log(results[0]);
                    if (results[0].length > 0) {
                        res.json(results[0]);
                    } else {
                        res.json({ resultado: 'error' });
                    }
                }
            });
    });

app.post('/ot_nv_entre_fechas',
    function(req, res) {
        // los parametros
        var fechaIni = req.body.fechaIni; // .toISOString();
        var fechaFin = req.body.fechaFin; // .toISOString();
        var query = '';
        //
        query = "call sp_ot_nv_entre_fechas ( '" + fechaIni + "','" + fechaFin + "' ) ;";
        console.log(query);
        //
        conex.query({ sql: query, timeout: 3000 },
            function(er, results) {
                if (er) {
                    console.log('error->', er);
                    res.json({ resultado: 'error' });
                    //throw er; 
                } else {
                    console.log(results);
                    res.json(results);
                }
            });
    });

app.post('/tabla',
    function(req, res) {
        // la tabla a leer
        var xTop = req.body.top || '';
        var xSelect = req.body.select || ' * ';
        var xTabla = req.body.tabla || '';
        var xWhere = req.body.where || '';
        var xOrderBy = req.body.orderby || '';
        //
        if (xTop != '') {
            xTop = ' limit ' + xTop + ' ';
        }
        if (xSelect != '') {
            xSelect = xSelect.trim();
        }
        if (xWhere != '') {
            xWhere = ' where ' + xWhere.trim();
        }
        if (xOrderBy != '') {
            xOrderBy = ' order by ' + xOrderBy.trim();
        }
        //
        var query = "select " + xSelect + " from " + xTabla.trim() + " " + xWhere + " " + xTop + xOrderBy;
        console.log(query);
        //	
        conex.query({ sql: query, timeout: 4000 },
            function(er, rs, fields) {
                if (er == null) {
                    res.json(rs);
                } else {
                    res.json(er.code);
                }
            });
    });

app.post('/nuevatarea',
    function(req, res) {
        // variables
        var id_registro = 0;
        var todo_ok = true;
        var elerror = '';
        var xhoy = new Date();
        xhoy = xhoy.toISOString();
        // los parametros
        var data = req.body.data;
        //
        // console.log('req.body',data);
        //
        sql = "call sp_registro_insert ( '" + data.codigousr + "','" + data.empresa + "','" + data.sector + "','" + data.zona + "','" + xhoy + "',";
        sql += "'" + data.clasificacion + "','" + data.descripcion_nc.trim() + "','" + data.solicitud.trim() + "'," + data.presupuesto + ",'" + data.responsable + "',";
        sql += "'" + data.fcompromiso + "','" + data.prevencionista + "','" + data.fcumplimiento + "' ) ; ";
        //
        conex.query({ sql: sql, timeout: 3000 },
            function(error, results) {
                if (error) {
                    console.log(error);
                    res.json({ resultado: 'problemas en rollback ' + error });
                } else {
                    console.log('GRABACION ok', results[0][0]);
                    // se guarda imagen si existe....
                    if (data.imagen_r) {
                        _ttoImg.grabaImg_001(conex, data.imagen_r, results[0][0].id_reg, 'reg_');
                    }
                    res.json({ resultado: 'ok', id: results[0][0].id_reg });
                }
            });
    });

app.post('/consultaid',
    function(req, res) {
        // los parametros
        var usuario = req.body.codigousr || '';
        var empresa = req.body.empresa || '1';
        var id = req.body.id || '';
        var responsable = req.body.responsable || '';
        var experto = req.body.experto || '';
        var query = "call sp_rescataid ( '" + usuario + "'," + empresa + "," + id + ",'" + responsable + "','" + experto + "' ) ;";
        //
        console.log(query);
        //
        conex.query({ sql: query, timeout: 2000 },
            function(er, results) {
                if (er) {
                    console.log('error->', er);
                    res.json({ resultado: 'error' });
                } else {
                    console.log(results);
                    res.json(results);
                }
            });
    }
);

app.post('/cerrarid',
    function(req, res) {
        // fecha de hoy
        var xhoy = new Date();
        xhoy = xhoy.toISOString();
        // los parametros
        var usuario = req.body.codigousr || '';
        var empresa = req.body.empresa || '1';
        var id = req.body.id || '';
        var responsable = req.body.responsable || '';
        var experto = req.body.experto || '';
        var fechacierre = req.body.fechacierre || xhoy;
        var observacion = req.body.observacion || '';
        var img_base64 = req.body.img_base64 || '';
        var tipo_nombre;
        //
        if (responsable == 'R') { tipo_nombre = 'res_'; } else if (experto == 'E') { tipo_nombre = 'exp_'; }
        //
        var query = "call sp_cierraid ( '" + usuario + "'," + empresa + "," + id + ",'" + fechacierre + "','" + observacion + "','" + responsable + "','" + experto + "' ) ;";
        //
        console.log(query);
        //
        conex.query({ sql: query, timeout: 2000 },
            function(er, results) {
                //
                console.log('results', results);
                console.log('results[0]', results[0]);
                console.log('results[0][0]', results[0][0]);
                //
                if (er) {
                    console.log('error->', er);
                    res.json({ resultado: 'error' });
                } else {
                    console.log(tipo_nombre, results[0][0].id_reg);
                    if (img_base64) {
                        _ttoImg.grabaImg_001(conex, img_base64, id, tipo_nombre);
                    }
                    res.json(results);
                }
            });
    }
);

app.post('/insusr',
    function(req, res) {
        // variables
        var todo_ok = true;
        var elerror = '';
        var xhoy = new Date();
        xhoy = xhoy.toISOString();
        // los parametros
        var xcodigousr = req.body.codigousr;
        var xempresa = req.body.empresa;
        var xnombre = req.body.nombre;
        var xrut = req.body.rut;
        var xcreacion = xhoy;
        var xactivo = 'SI';
        var xclave = req.body.clave;
        var xemail = req.body.email;
        var xdireccion = req.body.direccion;
        var xciudad = req.body.ciudad;
        var xtelefono = req.body.telefono;
        var ximagen = '';
        var xcodigorol = req.body.codigorol;
        //
        async.series([
            function(callback) {
                if (todo_ok) {
                    conex.query("start transaction",
                        function(error, results, fields) {
                            if (error) {
                                //console.log('error: start tran',error);
                                elerror = error;
                                todo_ok = false;
                            } else {
                                console.log('ok: start tran');
                                todo_ok = true;
                            }
                            callback();
                        });
                } else {
                    console.log('error: no todo_ok', todo_ok);
                    callback();
                }
            },
            function(callback) {
                if (todo_ok) {
                    sql = "insert into usuarios (codigousr,nombre,rut,creacion,activo,clave,email,direccion,ciudad,telefono,imagen,codigorol,empresa) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    conex.query({ sql: sql, timeout: 3000, values: [xcodigousr, xnombre, xrut, xcreacion, xactivo, xclave, xemail, xdireccion, xciudad, xtelefono, ximagen, xcodigorol, xempresa] },
                        function(error, results, fields) {
                            if (error) {
                                //console.log(error);
                                elerror = error;
                                todo_ok = false;
                            } else {
                                console.log('ok: insert usuarios ');
                                todo_ok = true;
                            }
                            callback();
                        });
                } else {
                    console.log('error: no todo_ok', todo_ok);
                    callback();
                }
            },
            function(callback) {
                if (todo_ok) {
                    sql = "insert into nexo_empresas_usuarios (empresa,codigousr) values (?,?) ";
                    conex.query({ sql: sql, values: [xcodigousr, xempresa] },
                        function(error, results, fields) {
                            if (error) {
                                elerror = error;
                                todo_ok = false;
                            } else {
                                console.log('ok: insert nexo_e_u');
                                todo_ok = true;
                            }
                            callback();
                        });
                } else {
                    console.log('error: no todo_ok', todo_ok);
                    callback();
                }
            },
            function(callback) {
                if (todo_ok) {
                    sql = "insert into nexo_usuarios_roles (codigousr,codigorol) values (?,?) ";
                    conex.query({ sql: sql, values: [xcodigousr, xcodigorol] },
                        function(error, results, fields) {
                            if (error) {
                                elerror = error;
                                todo_ok = false;
                            } else {
                                console.log('ok: insert nexo_u_r');
                                todo_ok = true;
                            }
                            callback();
                        });
                } else {
                    console.log('error: no todo_ok', todo_ok);
                    callback();
                }
            },
            function(callback) {
                if (todo_ok) {
                    conex.query("commit", function(error, results, fields) {
                        if (error) {
                            elerror = error;
                            todo_ok = false;
                        } else {
                            console.log('ok: commit');
                            todo_ok = true;
                        }
                        callback();
                    });
                } else {
                    console.log('error: no todo_ok commit ', todo_ok);
                    callback();
                }
            },
            function(callback) {
                if (todo_ok) {
                    console.log("end");
                    res.json({ resultado: 'ok' });
                    callback();
                } else {
                    conex.query("rollback", function(error, results, fields) {
                        if (error) {
                            res.json({ resultado: 'problemas en rollback ' + eror });
                        } else {
                            console.log('ok: rollback');
                            res.json({ resultado: 'problemas', texto: elerror });
                        }
                        callback();
                    });
                }
            }
        ]);
    });