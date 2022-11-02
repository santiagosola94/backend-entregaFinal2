import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super('productos', {
            nombre: {type: String, required: true},
            descripcion: {type: String, required: true},
            precio: {type: Number, required: true},
            stock: {type: Number, required: true},
            codigo: {type: String, required: true},
            foto: {type: String, required: true},
            timestamp: {type: String, required: true}
        })
    }

}

export default ProductosDaoMongoDb