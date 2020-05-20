function cargarContacto() {
    const contactoRef = db.collection('contacto').doc('contactoUnico');
    var data;
    contactoRef.get().then(function (doc) {
        data = doc.data();
        var imagenEditar = document.getElementById('imagenEditarContacto');
        imagenEditar.setAttribute('src', data.foto);
        var textoNombre = document.getElementById('textoNombre');
        textoNombre.setAttribute('value', data.nombre);
        var textoTelefono = document.getElementById('textoTelefono');
        textoTelefono.setAttribute('value', data.telefono);
        var textoDireccion = document.getElementById('textoDireccion');
        textoDireccion.setAttribute('value', data.direccion);
    })
}

function modificarContacto() {
    const imagenRef = almacenamientoRef.child("fotoContacto.jpg");
    const imagen = document.getElementById('imagenModificarContacto').files[0];
    if (validarImagen(imagen))
        try {
            var contactoNuevo = {
                nombre: document.getElementById('textoNombre').value,
                telefono: document.getElementById('textoTelefono').value,
                direccion: document.getElementById('textoDireccion').value,
                foto: document.getElementById('imagenEditarContacto').getAttribute('src') + "1"
            }
            db.collection('contacto').doc('contactoUnico').set(contactoNuevo);
            if (imagen != null)
                imagenRef.put(imagen).then(function () {
                    alert("Se ha actualizado correctamente");
                    cargarContacto();
                });
            else {
                alert("Se ha actualizado correctamente");
                cargarContacto();
            }
        }
        catch{
            alert("Se ha presentado un error al actualizar los datos");
        }
}
