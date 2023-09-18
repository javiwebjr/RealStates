(function() {
    const lat = document.querySelector('#lat').value || 13.6933455;
    const lng = document.querySelector('#lng').value || -89.2388511;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;

    //Provider y Geocoder

    const geocodeService = L.esri.Geocoding.geocodeService();


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar el movimiento del pin y leer su latitud y longitud
    marker.on('moveend', function(e){
        marker = e.target;

        const posicion = marker.getLatLng();
        
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        //obtener la informacion de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 16).run(function(error, resultado){
            // console.log(resultado);

            marker.bindPopup(resultado.address.LongLabel)

            //llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })

    })

})()