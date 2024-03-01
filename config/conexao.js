const Sequezile = require("sequelize");

const connection = new Sequezile("mundoDireito", "root", "dev123456!", {
    host:'localhost',
    dialect:'mysql',
    define: {
        timestamps: false
    }
});

connection.authenticate()
.then(function(){
    console.log("Conexão com o banco de dados realizada com sucesso!")    
}).catch(function(err){
    console.log(err , "Erro na conexão")
})

module.exports = connection;