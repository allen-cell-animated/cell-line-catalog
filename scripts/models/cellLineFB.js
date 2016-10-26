(function(module) {

  FirebaseRef = firebase.database();
  FirebaseallCellLines = FirebaseRef.ref('/celllines');
// Create a root reference
  FirebaseRef.storageRef = firebase.storage().ref();

  FirebaseRef.signin = function(){
    $('#sign-in').submit(signin);
    function signin() {
      event.preventDefault();
      var email    = $('#username').val();
      var password = $('#password').val();
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // ...
      });
    }
  };
  FirebaseallCellLines.on('value', function(snapshot) {
    if (snapshot.val()) {
      CellLine.allCellLinesFB = snapshot.val();
    }
    else {
      CellLine.allCellLinesFB = [];
    }
  });




  module.FirebaseRef = FirebaseRef;
})(window);
