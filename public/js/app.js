var db; // referencia a base de datos
var almacenamientoRef; // referencia a almacenamiento de imagenes

document.addEventListener("DOMContentLoaded", event => {
    db = firebase.firestore();
    almacenamientoRef = firebase.storage().ref();
    var usuarioNombre = document.getElementById('usuarioNombre');

    db.collection('usuario').doc('usuarioUnico').get().then(function (doc) {
        usuarioNombre.textContent = doc.data().nombre;
    });
})

// generador de nombres aleatorios para las imagenes
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// para abrir los contenedores
function openBox(box) {
    var i;
    var x = document.getElementsByClassName("box");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(box).style.display = "block";
}

// para agregar varios atributos
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function validarImagen(imagen) {
    var idxDot = imagen.name.lastIndexOf(".") + 1;
    var extFile = imagen.name.substr(idxDot, imagen.name.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        return true;
    } else {
        alert("Solo se admiten imágenes tipo png, jpg o jpeg");
        return false;
    }
}

function cerrarSesion() {
    window.location.replace('../login.html');
}
