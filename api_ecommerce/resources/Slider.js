export default {
    slider_list: (slider) => {
        return {
            _id: slider._id,
            title: slider.title,
            link: slider.link,
            imagen: slider.imagen,
            imagen_home: 'http://localhost:3000'+'/api/sliders/uploads/slider/'+slider.imagen,
            state: slider.state,
        }
    }
}