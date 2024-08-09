export default {
    cart_list: (cart) => {
        return {
            _id: cart._id,
            user: cart.user,
            product: {
                _id: cart.product._id,
                title: cart.product.title,
                sku: cart.product.sku,
                slug: cart.product.slug,
                imagen: 'http://localhost:3000'+'/api/products/uploads/product/'+cart.product.portada,//*
                categorie: cart.product.categorie,
                price_pesos: cart.product.price_pesos,
                price_usd: cart.product.price_usd,
            },
            type_discount: cart.type_discount,
            discount: cart.discount,
            cantidad: cart.cantidad,
            variedad: cart.variedad,
            code_cupon: cart.code_cupon,
            code_discount: cart.code_discount,
            price_unitario: cart.price_unitario,
            subtotal: cart.subtotal,
            total: cart.total,
        }
    }
}