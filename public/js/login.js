var db;
var almacenamientoRef;

document.addEventListener("DOMContentLoaded", event => {
    db = firebase.firestore();
    almacenamientoRef = firebase.storage().ref();
})

(function logear(){

    const catalogoRef = db.collection('usuario').doc('usuarioUnico');
    const query = catalogoRef;

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    query.get()
    .then(function(doc){
        data = doc.data()
        if(data.nombre == username && data.contrasena == password){
            alert('Ingreso corrrectamente')
            window.location.replace('../menuprincipal.html');
        }
        else{
            alert('Usuario o contraseña incorrectos')
        }
    }).catch(function(error){
        console.log(error)
    });
   
}());