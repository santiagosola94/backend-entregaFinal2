import mongoose from "mongoose";
import Configuraciones from "../config.js";

mongoose.connect(Configuraciones.mongodb.url)

class ContenedorMongoDb {
    constructor(coleccion, schema) {
        this.modeloMongoose = mongoose.model(coleccion, schema)
    }

    async getAll() {
        try {
            return await this.modeloMongoose.find({})
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(numero) {
        try {
            const buscar = await this.modeloMongoose.find({'_id': numero})
            if (buscar.length == 0) {
                console.error('El id ingresado es incorrecto')
            } else {
                return buscar
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(obj) {
        try {
            await this.modeloMongoose.create(obj) 
            return {creado: true, obj}
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async updateProduct(id, obj) {
        try {
            await this.modeloMongoose.updateOne({_id: id}, {$set: obj})
            console.log('Usuario Actualizado')
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    async deleteProductById(number) {
        try {
            return await this.modeloMongoose.deleteOne({_id: number})
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAll(){
        try {
            return await this.modeloMongoose.deleteMany({})
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }
}

export default ContenedorMongoDb;