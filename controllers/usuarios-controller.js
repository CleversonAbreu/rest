const mysql   = require('../mysql');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const util    = require('../lib/util');

exports.cadastrarUsuario = async (req,res,next)=>{
    try {
        const query  = "SELECT * FROM  usuarios where email=?";
        const result = await mysql.execute(query,[req.body.email]);   
        
        if(result.length>0){
            return res.status(401).send({mensagem:'Usuário já cadastrado'});
        }

        const hsenha       = await util.criarHash(req.body.senha);
        const queryInsert  = "INSERT INTO usuarios(email,senha) VALUES (?,?)";
        const resultInsert = await mysql.execute(queryInsert, [req.body.email,hsenha]);   

        response = {
            mensagem:'Usuario criado com sucesso',
            usuarioCriado:{
                id_usuario: resultInsert.insertId,
                email:req.body.email,                        
            }
        }    
        return res.status(201).send(response);        

    } catch (error) {
        if(error){return res.status(500).send({error:error})}
    }
}


//logar usuario
exports.logar = async (req,res,next)=>{
    try {
        const query  = "SELECT * FROM  usuarios where email=?";
        const result = await mysql.execute(query,[req.body.email]);   

        if(result.length<1){
            return res.status(401).send({mensagem:'Falha na autenticação'});
        }

        const compar  = await util.comparar(req.body.senha,result[0].senha);

        if(compar){
            const token =jwt.sign({
                id_usuario: result[0].id_usuario,
                email:result[0].email
            },
            process.env.JWT_KEY,
            {
                expiresIn:"1h"
            });
            return res.status(200).send({
                mensagem:'Autenticado com sucesso',
                token:token
            });
        }else{
            return res.status(401).send({mensagem:'Falha na autenticação'});
        }
        
    } catch (error) {
        if(error){return res.status(500).send({error:error})}
    }
}