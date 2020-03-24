var imagen;
var descripcion;

// generador de nombres aleatorios para las imagenes
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// inicio inputs

// en input de imagen  poner -> onchange="imagenTemporal(this.files)"
function imagenTemporal(imagenes) {
    imagen = imagenes.item(0);
}
// en input poner -> onchange="textoTemporal(this.value)"
function textoTemporal(descripcion) {
    this.descripcion = descripcion;
}
// fin inputs

function limpiarVariables() {
    imagen = null;
    descripcion = null;
}

// INICIO CATALOGO

function subirArchivosCatalogo() {
    const db = firebase.firestore();
    const almacenamientoRef = firebase.storage().ref();
    const claveImagen = uuidv4();
    const imagenRef = almacenamientoRef.child(claveImagen);
    const tareaSubir = imagenRef.put(imagen);

    tareaSubir.then(snapshot => {
        const url = snapshot.ref.getDownloadURL().then(function (downloadURL) {
            db.collection("catalogo").add({
                descripcion: descripcion,
                imagen: downloadURL,
                claveImagen: claveImagen
            })
            limpiarVariables();
        })
    })
}

function mostrarArchivosCatalogo(){
    const catalogoRef = db.collection('catalogo');
}

// FIN CATALOGO