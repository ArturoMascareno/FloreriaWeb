var tipoPromo;

function subirArchivosPromocion(tipo) {
    const claveImagen = uuidv4();
    const imagenRef = almacenamientoRef.child(claveImagen);
    var imagen;
    if (tipo == 'arreglo'){
        imagen = document.getElementById('imagenAgregarArreglo').files[0];
        console.log("entre")}
    else
        imagen = document.getElementById('imagenAgregarEvento').files[0];
    console.log(imagen)
    try {
        const tareaSubir = imagenRef.put(imagen);
        tareaSubir.then(snapshot => {
            const url = snapshot.ref.getDownloadURL().then(function (downloadURL) {
                db.collection("promocion").add({
                    tipo: tipo,
                    imagen: downloadURL,
                    claveImagen: claveImagen
                })
                alert("Datos guardados con éxito");
            }).catch(function (error) {
                alert("Error al subir los datos")
                console.log("mas adentro")
            })
        })
    }
    catch {
        alert("Error al subir los datos");
        console.log("ups")
    }
}

function mostrarArchivosPromocion(tipo) {
    const promocionRef = db.collection('promocion');
    const query = promocionRef;
    tipoPromo = tipo;

    // para evitar duplicados
    let spanOriginal = document.createElement('span');
    if (tipo == 'arreglo') {
        spanOriginal.setAttribute('id', 'productosPromoArreglo');
        productosPromoArreglo.replaceWith(spanOriginal);
        productosPromoArreglo = spanOriginal
    } else {
        spanOriginal.setAttribute('id', 'productosPromoEvento');
        productosPromoEvento.replaceWith(spanOriginal);
        productosPromoEvento = spanOriginal
    }

    query.get()
        .then(products => {
            products.forEach(doc => {
                const data = doc.data()
                if (data.tipo == tipo) {

                    // creacion de los elementos
                    let div1 = document.createElement('div');
                    let imgProducto = document.createElement('img');
                    let div2 = document.createElement('div');
                    let div3 = document.createElement('div');
                    let botonModificar = document.createElement('button');
                    let imgModificar = document.createElement('img');
                    let div4 = document.createElement('div');
                    let botonEliminar = document.createElement('button');
                    let imgEliminar = document.createElement('img');

                    // creacion de los atributos de los elementos
                    div1.setAttribute('class', 'producto');
                    setAttributes(imgProducto, { 'class': 'producto-imagen', 'src': data.imagen });
                    div2.setAttribute('class', 'producto-botones');
                    div3.setAttribute('class', 'buttons');
                    botonModificar.setAttribute('doc-id', doc.id);
                    if (tipo == 'arreglo')
                        botonModificar.setAttribute('onclick', 'openBox(\'ModificarArreglos\')');
                    else
                        botonModificar.setAttribute('onclick', 'openBox(\'ModificarEventos\')');
                    setAttributes(imgModificar, { 'src': '../recursos/create-24px.svg', 'width': '30px', 'height': '30px' });
                    div4.setAttribute('class', 'buttons');
                    setAttributes(botonEliminar, { 'doc-id': doc.id, 'descripcion': data.descripcion, 'url': data.imagen })
                    setAttributes(imgEliminar, { 'src': '../recursos/clear-24px.svg', 'width': '30px', 'height': '30px' });

                    // anidación de los elementos
                    div1.appendChild(imgProducto);
                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(botonModificar);
                    botonModificar.appendChild(imgModificar);
                    div2.appendChild(div4);
                    div4.appendChild(botonEliminar);
                    botonEliminar.appendChild(imgEliminar);

                    // despliegue de los elementos
                    if (tipo == 'arreglo') {
                        productosPromoArreglo.appendChild(div1);
                    } else {
                        productosPromoEvento.appendChild(div1);
                    }

                    botonEliminar.addEventListener('click', (e) => {
                        e.stopPropagation();
                        let id = botonEliminar.getAttribute('doc-id');
                        borrarArchivosPromocion(id);
                    })

                    botonModificar.addEventListener('click', (e) => {
                        e.stopPropagation();
                        let id = botonModificar.getAttribute('doc-id');
                        if (tipo == 'arreglo')
                            document.getElementById('btnGuardarImagenArreglo').setAttribute('doc-id', id);
                        else
                            document.getElementById('btnGuardarImagenEvento').setAttribute('doc-id', id);
                        let url = botonEliminar.getAttribute('url');
                        cargarModificarArchivosPromocion(url);
                    })
                }
            })
        })
}

function borrarArchivosPromocion(docId) {
    const docData = db.collection('promocion').doc(docId);
    docData.onSnapshot(doc => {
        const data = doc.data();
        if (doc.exists == true)
            almacenamientoRef.child(data.claveImagen).delete().then(function () {
                docData.delete();
                alert("Borrado con éxito")
                mostrarArchivosPromocion(tipoPromo);
            }).catch(function (error) {
                alert("Error al borrar archivo")
            })
    })
}
// despliega los registros actuales
function cargarModificarArchivosPromocion(url) {
    if (tipoPromo == 'arreglo')
        var imagenEditar = document.getElementById('imagenEditarArreglo');
    else
        var imagenEditar = document.getElementById('imagenEditarEvento');
    imagenEditar.setAttribute('src', url);
}

function modificarArchivosPromocion() {
    var imagen;
    if (tipoPromo == 'arreglo')
        imagen = document.getElementById('imagenModificarArreglo').files[0];
    else
        imagen = document.getElementById('imagenModificarEvento').files[0];
    try {
        let id;
        if (tipoPromo == 'arreglo')
            id = document.getElementById('btnGuardarImagenArreglo').getAttribute('doc-id');
        else
            id = document.getElementById('btnGuardarImagenEvento').getAttribute('doc-id');
        const docData = db.collection('promocion').doc(id);

        const query = docData;
        query.get()
            .then(function (doc) {
                const data = doc.data();
                const imagenRef = almacenamientoRef.child(data.claveImagen);
                var promocion = {
                    claveImagen: data.claveImagen, // la clave ya existente
                    tipo: tipoPromo, // la nueva descripción
                    imagen: data.imagen + "1" // la url ya existente
                }
                docData.set(promocion);
                if (imagen != null)
                    imagenRef.put(imagen).then(function () {
                        alert("Se ha actualizado correctamente");
                        mostrarArchivosPromocion(tipoPromo);
                        if (tipoPromo == 'arreglo')
                            openBox('Arreglos');
                        else
                            openBox('Eventos');
                    });
                else {
                    alert("Se ha actualizado correctamente");
                    mostrarArchivosPromocion(tipoPromo);
                    if (tipoPromo == 'arreglo')
                        openBox('Arreglos');
                    else
                        openBox('Eventos');
                }
            }
            ).catch(function (error) {
                alert(error);
            });
    }
    catch{
        alert("Se ha presentado un error al actualizar los datos");
    }
}