const mysql   = require('../mysql').pool;
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

//cadastrar usuarios 
exports.cadastrarUsuario = (req,res,next)=>{
    
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        conn.query('Select * from usuarios where email=?',[req.body.email],(error,results)=>{
            if(error){return res.status(500).send({error:error})}
           
            if(results.length>0){ 
                return res.status(401).send({mensagem:'Usuário ja cadastrado'});     
            }else{
                bcrypt.hash(req.body.senha,10,(errBcrypt,hash)=>{
                    if(errBcrypt){return res.status(500).send({error:errBcrypt})}
                    conn.query("INSERT INTO usuarios(email,senha) VALUES (?,?)",
                    [req.body.email,hash],
                    (error,results)=>{ 
                        conn.release();
                        if(error){return res.status(500).send({error:error})}
                        response = {
                            mensagem:'Usuario criado com sucesso',
                            usuarioCriado:{
                                id_usuario: results.insertId,
                                email:req.body.email,                        
                            }
                        }    
                        return res.status(201).send(response);                    
                    })
                });
            }
        })   
    });
}

//logar usuario
exports.logar = (req,res,next)=>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        const query='SELECT * FROM  usuarios where email=?';
        conn.query(query,[req.body.email],(error,results,fields)=>{
            conn.release();
            if(error){return res.status(500).send({error:error})}
            if(results.length<1){
                return res.status(401).send({mensagem:'Falha na autenticação'});
            }
            bcrypt.compare(req.body.senha,results[0].senha,(erro,result)=>{
                if(erro){
                    return res.status(401).send({mensagem:'Falha na autenticação'});
                }
                if(result){
                    const token =jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email:results[0].email
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn:"1h"
                    });
                    return res.status(200).send({
                        mensagem:'Autenticado com sucesso',
                        token:token
                    });
                }
                return res.status(401).send({mensagem:'Falha na autenticação'});
            });
        })

    });
}