var imagen;
var descripcion;
var db; // referencia a base de datos
var almacenamientoRef; // referencia a almacenamiento de imagenes
var idDocModificar; //El id del documento actual cuando se presione modificar
var data; //data para modificar
var downloadURLAux;
var productosCatalogo = document.querySelector('#productosCatalogo'); // span de catalogo

document.addEventListener("DOMContentLoaded", event => {
    db = firebase.firestore();
    almacenamientoRef = firebase.storage().ref();
})

// generador de nombres aleatorios para las imagenes
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// INICIO inputs

// en input de imagen  poner -> onchange="imagenTemporal(this.files)"
function imagenTemporal(imagenes) {
    imagen = imagenes.item(0);
}
// en input de texto poner -> onchange="textoTemporal(this.value)"
function textoTemporal(descripcion) {
    this.descripcion = descripcion;
}

// FIN inputs

function limpiarVariables() {
    imagen = null;
    descripcion = null;
    idDocModificar = null;
    data = null;
    downloadURLAux = null;
}

// INICIO CATALOGO

function subirArchivosCatalogo() {
    const claveImagen = uuidv4();
    const imagenRef = almacenamientoRef.child(claveImagen);
    try {
        const tareaSubir = imagenRef.put(imagen);
        tareaSubir.then(snapshot => {
            const url = snapshot.ref.getDownloadURL().then(function (downloadURL) {
                db.collection("catalogo").add({
                    descripcion: descripcion,
                    imagen: downloadURL,
                    claveImagen: claveImagen
                })
                limpiarVariables();
                alert("Datos guardados con éxito");
            }).catch(function (error) {
                alert("Error al subir los datos")
            })
        })
    }
    catch {
        alert("Error al subir los datos");
    }
}


function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function mostrarArchivosCatalogo() {
    const catalogoRef = db.collection('catalogo');
    const query = catalogoRef;

    // para evitar duplicados
    let spanOriginal = document.createElement('span');
    spanOriginal.setAttribute('id', 'productosCatalogo');
    productosCatalogo.replaceWith(spanOriginal);
    productosCatalogo = spanOriginal

    query.get()
        .then(products => {
            products.forEach(doc => {
                data = doc.data()
                // creacion de los elementos
                let div1 = document.createElement('div');
                let lblDescripcion = document.createElement('label');
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
                lblDescripcion.textContent = data.descripcion;
                setAttributes(imgProducto, { 'class': 'producto-imagen', 'src': data.imagen });
                div2.setAttribute('class', 'producto-botones');
                div3.setAttribute('class', 'buttons');
                botonModificar.setAttribute('doc-id', doc.id);
                botonModificar.setAttribute('onclick', 'openBox(\'ModificarCatalogo\')');
                setAttributes(imgModificar, { 'src': 'create-24px.svg', 'width': '30px', 'height': '30px' });
                div4.setAttribute('class', 'buttons');
                botonEliminar.setAttribute('doc-id', doc.id);
                setAttributes(imgEliminar, { 'src': 'clear-24px.svg', 'width': '30px', 'height': '30px' });
                // anidación de los elementos
                div1.appendChild(lblDescripcion);
                div1.appendChild(imgProducto);
                div1.appendChild(div2);
                div2.appendChild(div3);
                // botonModificar.setAttribute('doc-id', doc.id);
                div3.appendChild(botonModificar);
                botonModificar.appendChild(imgModificar);
                div2.appendChild(div4);
                div4.appendChild(botonEliminar);
                botonEliminar.appendChild(imgEliminar);
                // despliegue de los elementos
                productosCatalogo.appendChild(div1);

                botonEliminar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let id = botonEliminar.getAttribute('doc-id');
                    borrarArchivosCatalogo(id);
                })

                botonModificar.addEventListener('click', (e) => {
                    debugger;
                    e.stopPropagation();
                    let id = botonModificar.getAttribute('doc-id');
                    document.getElementById('btnGuardarImagen').setAttribute('doc-id', id);

                })
            })
        })
}
function borrarArchivosCatalogo(docId) {
    const docData = db.collection('catalogo').doc(docId);
    docData.onSnapshot(doc => {
        const data = doc.data();
        if (doc.exists == true)
            almacenamientoRef.child(data.claveImagen).delete().then(function () {
                docData.delete();
                alert("Borrado con éxito")
                mostrarArchivosCatalogo();
            }).catch(function (error) {
                alert("Error al borrar archivo")
            })
    })
}

function modificarArchivosCatalago() {
    debugger;
    try {
        let id = document.getElementById('btnGuardarImagen').getAttribute('doc-id');
        descripcion = document.getElementById('inptEditarDescripcionImagen').value;

        const docData = db.collection('catalogo').doc(id);
        //Aqui creo el nuevo url con la imagen nueva?

        // const claveImagen = uuidv4();
        // const imagenRef = almacenamientoRef.child(claveImagen);
        // try {
        //     const tareaSubir = imagenRef.put(imagen);
        //     tareaSubir.then(snapshot => {
        //         const url = snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //             db.collection("catalogo").add({
        //                 descripcion: descripcion,
        //                 imagen: downloadURL,
        //                 claveImagen: claveImagen
        //             })
        //             downloadURLAux=downloadURL;
        //             alert("Datos guardados con éxito");
        //         }).catch(function (error) {
        //             alert("Error al subir los datos")
        //         })
        //     })
        // }
        // catch {
        //     alert("Error al subir los datos");
        // }

        const query = docData;
        query.get()
            .then(function (doc) {
                data = doc.data();
                var catalago = {
                    claveImagen: data.claveImagen, //
                    descripcion: descripcion,
                    imagen: downloadURLAux //AQUI PONES LA NUEVA URL
                }
                docData.set(catalago);
                limpiarVariables();
                alert("Se ha actualizado correctamente");
            }
            ).catch(function (error) {
                alert(error);
            });

    }
    catch{
        debugger;
        alert("Se ha presentado un error al actualizar los datos");
    }
}

// FIN CATALOGO
