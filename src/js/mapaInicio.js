(function (){
    const lat = 13.6933455;
    const lng = -89.2388511;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);

    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = [];

    //filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    })
    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();

            mostrarPropiedades(propiedades);


        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades => {

        //Limpiar los markers previos 
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            //Agregar los pines al mapa prinicipal
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <h1 class="text-xl font-extrabold uppercase my-5">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" atl="imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <p class="text-teal-600 font-bold">${propiedad.categoria.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-teal-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
            `)

            markers.addLayer(marker);
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter( filtrarCategoria ).filter(filtrarPrecios);
        mostrarPropiedades(resultado);
    }
    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;
    const filtrarPrecios = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad;

    obtenerPropiedades();
})()