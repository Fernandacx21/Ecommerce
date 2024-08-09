export default {
    categorie_list: (categorie) => {
        return {
            _id: categorie._id,
            title: categorie.title,
            imagen: categorie.imagen,
            imagen_home: 'http://localhost:3000'+'/api/categories/uploads/categorie/'+categorie.imagen,
            state: categorie.state,
        }
    }
}