// console.log("hola mundo");
var express = require('express');
var app = express();
// configuracion
var sql = require('mssql');
var dbconex = require('./conexion_mssql.js');
//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// carpeta de imagenes: desde donde se levanta el servidor es esta ruta -> /root/trial-server-001/public
app.use(express.static('public'));

// servidor escuchando puerto 3012
var server = app.listen(3012, function() {
    console.log("Escuchando http en el puerto: %s", server.address().port);
});

// --------------------------------------------centros 
app.get('/centros',
    function(req, res) {
        //
        var query = "select * from [valencia].[dbo].[centros] ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/centros',
    function(req, res) {
        //
        var query = "insert into [valencia].[dbo].[centros] (centro,descripcion) values ( '" + req.body.centro + "','" + req.body.descripcion + "' ) ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/centros',
    function(req, res) {
        //
        var query = "update [valencia].[dbo].[centros] set descripcion='" + req.body.descripcion + "' where centro='" + req.body.centro + "' ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/centros',
    function(req, res) {
        //
        var query = "delete [valencia].[dbo].[centros] where centro='" + req.body.centro + "' ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------entidades
app.get('/entidades',
    function(req, res) {
        // los parametros
        var query = '';
        var razonrut = req.query.razon;
        //
        if (razonrut === '' || razonrut === undefined) {
            query = "select * from [valencia].[dbo].[entidades] ;";
        } else {
            query = "select * from [valencia].[dbo].[entidades] " +
                " where codaux like '%" + razonorut.rtrim() + "%' " +
                " or rut like '%" + razonorut.rtrim() + "%' " +
                " or razonsocial like '%" + razonorut.rtrim() + "%' ;";
        }
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/entidades',
    function(req, res) {
        // los parametros
        var query = `insert into [valencia].[dbo].[entidades] (codaux,rut,razonsocial,direccion,comuna,ciudad,especialidad,calificacion) 
                    values ('${ req.query.codaux }',
                            '${ req.query.rut }',
                            '${ req.query.razonsocial }',
                            '${ req.query.direccion }',
                            '${ req.query.comuna }',
                            '${ req.query.ciudad }',
                            '${ req.query.especialidad }',
                             ${ req.query.calificacion } ); `;
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/entidades',
    function(req, res) {
        // los parametros
        var query = `update [valencia].[dbo].[entidades]
                    set rut='${ req.query.rut }',
                        razonsocial='${ req.query.razonsocial }',
                        direccion='${ req.query.direccion }',
                        comuna='${ req.query.comuna }',
                        ciudad='${ req.query.ciudad }',
                        especialidad='${ req.query.especialidad }',
                        calificacion=${ req.query.calificacion }
                    where codaux = '${ req.query.codaux }' ;`;
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/entidades',
    function(req, res) {
        //
        var query = "delete [valencia].[dbo].[entidades] where codaux='" + req.body.codaux + "' ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------servicios
app.get('/servicios',
    function(req, res) {
        //
        var query = "select * from [valencia].[dbo].[servicios] ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/servicios',
    function(req, res) {
        //
        var query = "insert into [valencia].[dbo].[servicios] (servicio,descripcion) values ( '" + req.body.servicio + "','" + req.body.descripcion + "' ) ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/servicios',
    function(req, res) {
        //
        var query = "update [valencia].[dbo].[servicios] set descripcion='" + req.body.descripcion + "' where servicio='" + req.body.servicio + "' ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/servicios',
    function(req, res) {
        //
        var query = "delete [valencia].[dbo].[servicios] where servicio='" + req.body.servicio + "' ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------planos
app.get('/planos',
    function(req, res) {
        // los parametros
        var query = '';
        var cliente = req.query.cliente;
        var codigo = req.query.codigo;
        //
        if (cliente !== undefined && codigo !== undefined) {
            query = `select * from [valencia].[dbo].[planos] where codaux = '${ cliente }' and codigo = '${ codigo }' ; `;
        } else {
            query = `select * from [valencia].[dbo].[planos] `;
        }
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/planos',
    function(req, res) {
        //
        var query = `insert into [valencia].[dbo].[planos] (plano,codaux,codigo,descripcion,extension,link,archivo) 
                    values ('${ req.query.plano}',
                            '${ req.query.codaux}',
                            '${ req.query.codigo}',
                            '${ req.query.descripcion}',
                            '${ req.query.extension}',
                            '${ req.query.link}',
                            '${ req.query.archivo}' ) ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/planos',
    function(req, res) {
        //
        var query = `update [valencia].[dbo].[planos]
                    set descripcion='${ req.query.descripcion}',
                        extension='${ req.query.extension}',
                        link='${ req.query.link}',
                        archivo='${ req.query.archivo}'
                    where plano  = '${ req.query.plano}'
                      and codaux = '${ req.query.codaux}'
                      and codigo = '${ req.query.codigo}' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/planos',
    function(req, res) {
        //
        var query = `delete [valencia].[dbo].[planos]
                    where plano  = '${ req.query.plano}'
                      and codaux = '${ req.query.codaux}'
                      and codigo = '${ req.query.codigo}' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------procesos
app.get('/procesos',
    function(req, res) {
        //
        var query = "select * from [valencia].[dbo].[procesos] ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/procesos',
    function(req, res) {
        //
        var query = `insert into [valencia].[dbo].[procesos] (proceso,descripcion,maquina,tienealternativas,tienesubprocesos) 
                    values ('${ req.query.proceso}',
                            '${ req.query.descripcion}',
                            '${ req.query.maquina}',
                            ${ req.query.tienealternativas },
                            ${ req.query.tienesubprocesos} ) ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/procesos',
    function(req, res) {
        //
        var query = `update into [valencia].[dbo].[procesos] 
                    set descripcion='${ req.query.descripcion}',
                        maquina='${ req.query.maquina}',
                        tienealternativas=${ req.query.tienealternativas },
                        tienesubprocesos=${ req.query.tienesubprocesos} ) 
                    where proceso = '${ req.query.proceso}' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/procesos',
    function(req, res) {
        //
        var query = `delete [valencia].[dbo].[procesos] 
                    where proceso = '${ req.query.proceso}' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------subprocesos
app.get('/subprocesos',
    function(req, res) {
        //
        var query = "";
        var proceso = req.query.proceso;
        if (proceso !== undefined) {
            query = "select * from [valencia].[dbo].[procesos_sub] where proceso = '" + proceso + "' ;";
        } else {
            query = "select * from [valencia].[dbo].[procesos_sub] ;";
        }
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/subprocesos',
    function(req, res) {
        //
        var query = `insert into [valencia].[dbo].[procesos_sub] (subproceso,proceso,descripcion) 
                    values ('${ req.query.subproceso }',
                            '${ req.query.proceso }',
                            '${ req.query.descripcion }') ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/subprocesos',
    function(req, res) {
        //
        var query = `update [valencia].[dbo].[procesos_sub]
                    set descripcion='${ req.query.descripcion }'
                    where subproceso='${ req.query.subproceso }'
                      and proceso='${ req.query.proceso }' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/subprocesos',
    function(req, res) {
        //
        var query = `delete [valencia].[dbo].[procesos_sub]
                    where subproceso='${ req.query.subproceso }'
                      and proceso='${ req.query.proceso }' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------maquinas
app.get('/maquinas',
    function(req, res) {
        //
        var query = "select * from [valencia].[dbo].[maquinas] ;";
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/maquinas',
    function(req, res) {
        //
        var query = `insert into [valencia].[dbo].[maquinas] (maquina,descripcion,activa,ultimaactualizacion) 
                    values ('${ req.query.maquina }',
                            '${ req.query.descripcion }',
                            ${ req.query.activa },
                            '${ req.query.ultimaactualizacion }') ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/maquinas',
    function(req, res) {
        //
        var query = `update [valencia].[dbo].[maquinas] 
                    set descripcion='${ req.query.descripcion }',
                        activa=${ req.query.activa },
                        ultimaactualizacion='${ req.query.ultimaactualizacion }' 
                    where maquina='${ req.query.maquina }' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/maquinas',
    function(req, res) {
        //
        var query = `delete [valencia].[dbo].[maquinas] 
                    where maquina='${ req.query.maquina }' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------operarios
app.get('/operarios',
    function(req, res) {
        // los parametros
        var query = '';
        var nombre = req.query.nombre;
        //
        if (nombre !== undefined) {
            query = `select * from [valencia].[dbo].[operarios] where nombre like '%${ nombre }%' ;`;
        } else {
            query = `select * from [valencia].[dbo].[operarios] `;
        }
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/operarios',
    function(req, res) {
        //
        var query = `insert into [valencia].[dbo].[operarios] (operario,nombre,esmaestro,ingreso,activo) 
                    values ('${ req.query.operario }',
                            '${ req.query.nombre }',
                            ${ req.query.esmaestro },
                            '${ req.query.ingreso }',
                            ${ req.query.activo }) ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/operarios',
    function(req, res) {
        //
        var query = `update [valencia].[dbo].[operarios] 
                    set nombre='${ req.query.nombre }'
                        esmaestro=${ req.query.esmaestro },
                        ingreso='${ req.query.ingreso }',
                        activo=${ req.query.activo }
                    where operario='${ req.query.operario }' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/operarios',
    function(req, res) {
        //
        var query = `delete [valencia].[dbo].[operarios] 
                    where operario='${ req.query.operario }' ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
// --------------------------------------------usuarios
app.get('/usuarios',
    function(req, res) {
        // los parametros
        var query = '';
        var email = req.query.email;
        var pssw = req.query.pssw
            //
        if (nombre !== undefined) {
            query = `select * from [valencia].[dbo].[usuarios] where email = '%${ email }%' and pssw = '${ pssw }' ;`;
        } else {
            query = `select id,email,nombre from [valencia].[dbo].[usuarios] `;
        }
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.post('/usuarios',
    function(req, res) {
        //
        var query = `insert into [valencia].[dbo].[usuarios] (email,nombre,pssw) 
                    values ('${ req.query.email }',
                            '${ req.query.nombre }',
                            '${ req.query.pssw }') ;`;
        //
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.put('/usuarios',
    function(req, res) {
        //
        var query = `update [valencia].[dbo].[usuarios]
                    set email='${ req.query.email }',
                        nombre='${ req.query.nombre }',
                        pssw='${ req.query.pssw }'
                    where id = ${id} ;`;
        //
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });
app.delete('/usuarios',
    function(req, res) {
        //
        var query = `delete [valencia].[dbo].[usuarios]
                    where id = ${id} ;`;
        //        
        sql.close();
        sql.connect(dbconex)
            .then(pool => {
                return pool.request().query(query);
            })
            .then(resultado => {
                // console.log(resultado);
                res.json({ resultado: 'ok', datos: resultado.recordset });
            })
            .catch(err => {
                console.log(err);
                res.json({ resultado: 'error', datos: err });
            });
    });

// --------------------------------------------actualizaciones y grandes lecturas