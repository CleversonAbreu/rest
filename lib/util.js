const bcrypt  = require('bcrypt');

exports.criarHash = (senha)=>{
    return new Promise((resolve,reject)=>{     
        bcrypt.hash(senha,10,(errBcrypt,hash)=>{
            if(errBcrypt){
                reject(errBcrypt);
            }else{
                resolve(hash)
            } 
        });       
    })
}

exports.comparar = (senhaPost,senhaBanco)=>{
    return new Promise((resolve,reject)=>{     
        bcrypt.compare(senhaPost,senhaBanco,(errBcrypt,compar)=>{
            if(errBcrypt){
                reject(errBcrypt);
            }else{
                resolve(compar)
            } 
        });       
    })
}

