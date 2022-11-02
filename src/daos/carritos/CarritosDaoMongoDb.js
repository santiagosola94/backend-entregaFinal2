import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";

class CarritosDaoMongoDb extends ContenedorMongoDb {
    constructor () {
        super('carritos', {
            timestampCarrito: {type: String, required: true},
            productos: {type: [], required: true}
        })
    }
}

export default CarritosDaoMongoDb