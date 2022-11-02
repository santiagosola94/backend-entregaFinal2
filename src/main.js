import express from 'express'
const {Router} = express
const app = express()

import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from './daos/index.js'

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    const productos = await productosApi.getAll()
    res.json(productos)
})

productosRouter.get('/:id', async (req,res)=>{
    const {id} = req.params
    const producto = await productosApi.getById(id)
    res.send(producto)
})

productosRouter.post('/', async (req,res)=>{
    const {nombre, descripcion, codigo, foto, precio, stock} = req.body
    const date = new Date()
    let timestamp = date.toLocaleString();
    const nuevoProducto = {nombre, descripcion, foto, codigo, precio, stock, timestamp}
    const producto = await productosApi.createProduct(nuevoProducto)
    res.send(producto)
})

productosRouter.put('/:id', async (req, res)=>{
    const {id} = req.params
    const producto = req.body
    const actualizarProducto = await productosApi.updateProduct(id, producto)
    res.send(actualizarProducto)
})

productosRouter.delete('/:id', async (req,res)=>{
    const {id} = req.params
    const eliminarProducto = await productosApi.deleteProductById(id)
    res.send(eliminarProducto)
})

productosRouter.delete('/', async (req,res)=>{
    const eliminarProducto = await productosApi.deleteAll()
    res.send(eliminarProducto)
})

const carritosRouter = new Router()

// CRUD Carrito

carritosRouter.get('/', async (req,res)=>{
    const productosCarro = await carritosApi.getAll()
    res.send(productosCarro)
})

// falta get/:id

carritosRouter.post('/', async (req,res)=>{
    const date = new Date()
    let timestampCarrito = date.toLocaleString();
    const nuevoCarrito = {timestampCarrito, productos: []}
    const producto = await carritosApi.createProduct(nuevoCarrito)
    res.send(producto)
})

carritosRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    const eliminarCarrito = await carritosApi.deleteProductById(id)
    res.send(eliminarCarrito)
})

carritosRouter.delete('/', async (req, res) => {
    const eliminarCarrito = await carritosApi.deleteAll()
    res.send(eliminarCarrito)
})

// CRUD Carrito Productos

carritosRouter.get('/:id/productos', async (req,res)=>{
    const {id} = req.params
    const leerCarrito = await carritosApi.getById(id)
    res.send(leerCarrito)
})

carritosRouter.post('/:id/productos', async(req,res)=>{
    const {id} = req.params
    const leerCarrito = await carritosApi.getById(id)
    const producto = await productosApi.getById(req.body.id)
    leerCarrito[0].productos.push(producto[0])
    await carritosApi.updateProduct(id, leerCarrito[0])
    res.send(leerCarrito)
})

carritosRouter.delete('/:id/productos/:idProd', async (req,res)=>{
    const {id, idProd} = req.params
    const leerCarrito = await carritosApi.getById(id)
    const posicion = leerCarrito[0].productos.findIndex(p => p._id == idProd)
    if (posicion != -1) {
        leerCarrito[0].productos.splice(posicion, 1)
        await carritosApi.updateProduct(id, leerCarrito[0])
        res.send('Producto Eliminado')
    } else{
        res.send('El producto que quiere eliminar no existe')
    }
    res.end()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

app.listen(8080, ()=>{
    console.log('Servidor iniciado')
})
