const mongoose = require('mongoose');

const url = 'mongodb+srv://josea1293:NPgSChqY6UsKOlm7@cluster0.la6e0.mongodb.net/test';

module.exports = () => {

    const conexion = () => {

        mongoose.connect(
            url,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) => {
                if(err) {
                    console.log('ERROR DB !! ');
                }else {
                    console.log('Base de dato conectada')
                }
            }
        )
    }

    conexion();
}
