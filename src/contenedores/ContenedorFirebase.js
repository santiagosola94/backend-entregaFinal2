import admin from 'firebase-admin'
import Configuraciones from '../config.js';

admin.initializeApp({
    credential: admin.credential.cert(Configuraciones.firebase),
    databaseURL: Configuraciones.firebase.project_id
})

const db = admin.firestore()

class ContenedorFirebase {
    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async getAll() {
        try {
            const leerProductos = await this.coleccion.get()
            let docs = leerProductos.docs
            const response = docs.map((doc)=>({
                id: doc.id, ...doc.data()
            }))
            return response
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(numero) {
        try {
            const buscar = this.coleccion.doc(numero)
            if (buscar.length == 0) {
                console.error('El id ingresado es incorrecto')
            } else {
                const item = await buscar.get()
                const response = item.data()
                return [response]
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(obj) {
        try {
            let validacion = obj.hasOwnProperty('_id')
            if(validacion) {
                const guardado = await this.coleccion.add(obj)
                return { ...obj, id: guardado.id }
            } else {
                const guardado = await this.coleccion.add(obj)
                const id = guardado.id
                const actualizar = this.coleccion.doc(id)
                const item = await actualizar.update({...obj, _id: id})
                return {...obj, _id: id}
            }
        } catch (error) {
            throw new Error(`Error al crear: ${error}`)
        }
    }

    async updateProduct(id, obj) {
        try {
            const actualizar = this.coleccion.doc(id)
            const item = await actualizar.update(obj)
            return {actualizado: true, modificado: obj}
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    async deleteProductById(id) {
        try {
            const eliminar = await this.coleccion.doc(id).delete()
            return {eliminado: true, idEliminado: id}
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAll(){
        try {
            const leerProductos = await this.coleccion.get()
            let docs = leerProductos.docs
            const response = docs.map((doc)=>({
                id: doc.id
            }))

            response.forEach(async (producto)=> await this.coleccion.doc(producto.id).delete())
            
            return {eliminado: true, IDEliminados: response}
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }
}

export default ContenedorFirebase;