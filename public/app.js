var imagen;
var descripcion;
var db; // referencia a base de datos
var almacenamientoRef; // referencoa a almacenamiento de imagenes
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
// regresa un array con url de imagen, descripcion, clave de imagen e id del documento contenedor
function mostrarArchivosCatalogo() {
    const catalogoRef = db.collection('catalogo');
    const query = catalogoRef;
    var catalogoRegistros = [];
    query.get()
        .then(products => {
            products.forEach(doc => {
                data = doc.data()
                catalogoRegistros.push({ "imagen": data.imagen, "descripcion": data.descripcion, "docId": doc.id })
            })
        })

    return catalogoRegistros;
}

function borrarArchivosCatalogo(docId) {
    const docData = db.collection('catalogo').doc(docId);
    docData.onSnapshot(doc => {
        const data = doc.data();
        almacenamientoRef.child(data.claveImagen).delete().then(function () {
            docData.delete();
            alert("Borrado con éxito")
        }).catch(function (error) {
            alert("Error al borrar archivo")
        })
    })
}

// FIN CATALOGO