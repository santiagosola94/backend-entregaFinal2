class ContenedorMemoria {
    constructor(){
        this.data = []
    }

    async getAll() {
        try {
            return [...this.data]
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(numero) {
        try {
            const producto = this.data.find(campo => campo._id == numero)
            if (producto == null) {
                return {error: true, msj: 'El id no existe'}
            } else {
                return [producto]
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(obj) {
        try {
            if (this.data.length == 0) {
                obj._id = 1
            } else {
                const listaIds = this.data.map((producto)=> {
                    return producto._id
                })
                obj._id = listaIds.pop() + 1
            }
            this.data.push(obj) 
            const nuevoProducto = obj
            return {creado: true, nuevoProducto}
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async updateProduct(id, obj) {
        try {
            const parsearId = parseInt(id)
            const productFind = this.data.find((productoEncontrado) => {
                return productoEncontrado._id == id
            })
            const indice = this.data.indexOf(productFind)

            this.data[indice] = {...obj, _id: parsearId}

            const nuevoProducto = this.data

            return {update: true, nuevoProducto}
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    async deleteProductById(number) {
        try {
            const productoEncontrado = this.data.find(campo => campo._id == number)
            const indice = this.data.indexOf(productoEncontrado)
            this.data.splice(indice, 1)
            return {delete: true, productoEliminado: productoEncontrado}
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAll(){
        try {
            return this.data = []
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }
}
export default ContenedorMemoria