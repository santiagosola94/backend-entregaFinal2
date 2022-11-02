import { promises as fs } from 'fs'
import Configuraciones from '../config.js';

class ContenedorArchivo {
    constructor(ruta) {
        this.ruta = `${Configuraciones.fileSystem.path}/${ruta}`;
    }

    async getAll() {
        try {
            const data = await fs.readFile(this.ruta);
            const productsList = JSON.parse(data)
            return productsList
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(numero) {
        try {
            const data = await fs.readFile(this.ruta);
            const listaDeProductos = JSON.parse(data)
            const productFind = listaDeProductos.find((productoEncontrado) => {
                return productoEncontrado._id == numero
            })
            return [productFind]
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(obj) {
        try {
            const data = await fs.readFile(this.ruta)
            const arrayProductos = JSON.parse(data)
            //const productoIncluido = arrayProductos.some((producto)=> producto.nombre == obj.nombre)
            
            //if (productoIncluido == false) {
                // Este if se encarga de generar el ID y que no se repita
                if (arrayProductos.length == 0) {
                    obj._id = 1
                } else {
                    const listaIds = arrayProductos.map((producto)=> {
                        return producto._id
                    })
                    obj._id = listaIds.pop() + 1
                }
                arrayProductos.push(obj)
                const arrayProductosStringify = JSON.stringify(arrayProductos)
                await fs.writeFile(this.ruta, `${arrayProductosStringify}`)
                const dataActualizada = await fs.readFile(this.ruta)
                return {creado: true}
            //} else {
                return {error: true, msj: 'el producto ya esta en la lista'}
            //}
        } catch (error) {
            throw new Error(`Error al crear: ${error}`)
        }
    }

    async updateProduct(id, obj) {
        try {
            const parsearId = parseInt(id)
            const data = await fs.readFile(this.ruta)
            const listaDeProductos = JSON.parse(data)
            const productFind = listaDeProductos.find((productoEncontrado) => {
                return productoEncontrado._id == id
            })
            const indice = listaDeProductos.indexOf(productFind)

            listaDeProductos[indice] = {...obj, _id: parsearId}

            const arrayProductosStringify = JSON.stringify(listaDeProductos)

            await fs.writeFile(this.ruta, `${arrayProductosStringify}`)

            const dataActualizada = await fs.readFile(this.ruta)
            return dataActualizada
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    async deleteProductById(id) {
        try {
            const data = await fs.readFile(this.ruta)
            const productList = JSON.parse(data)
            const productFound = productList.find((product) => {
                return product._id == id
            })

            if(productFound) {
                const positionProduct = productList.indexOf(productFound);
                productList.splice(positionProduct, 1)
        
                const stringifyProducts = JSON.stringify(productList)
        
                await fs.writeFile(this.ruta, `${stringifyProducts}`)
        
                return {eliminado: true, msj: `Se ha eliminado el producto con ID ${id}`}
            } else {
                return {eliminado: false, msj: `El id ingresado no se encuentra en nuestra base de datos`}
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAll(){
        try {
            const data = await fs.readFile(this.ruta);
            const productList = JSON.parse(data)
            productList.splice(0, productList.length)
            const arrayString = JSON.stringify(productList)
            await fs.writeFile(this.ruta, `${arrayString}`)
            
            return {eliminado: true, msj: 'Se han eliminado todos los productos'}
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }
}

export default ContenedorArchivo