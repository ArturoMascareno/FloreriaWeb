-
document.addEventListener("DOMContentLoaded", event => {
    db = firebase.firestore();
    almacenamientoRef = firebase.storage().ref();
})

function logear(){
    var logear1 = (function(){

        const catalogoRef = db.collection('usuario').doc('usuarioUnico');
        const query = catalogoRef;
    
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
    
        var hash = CryptoJS.MD5(password);
    
        query.get()
        .then(function(doc){
            var data = doc.data()
            if(data.nombre == username && data.contrasena == hash){
                alert('Ingresó correctamente ' + data.nombre)
                window.location.replace('../menuprincipal.html');
            }
            else{
                alert('Usuario o contraseña incorrectos')
            }
        }).catch(function(error){
            console.log(error)
        });
    }())
}
