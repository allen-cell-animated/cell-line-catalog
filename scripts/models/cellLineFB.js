(function(module) {

  firebaseLocal = firebase.database();
  FirebaseallCellLines = firebaseLocal.ref('/celllines');
  firebaseLocal.storageRef = firebase.storage().ref();

  $( document ).ready(function() {
    FirebaseallCellLines.on('value', function(snapshot) {
      if (snapshot.val()) {
        CellLine.allCellLinesFB = snapshot.val();
        console.log('loaded firebase cellines');
      }
      else {
        console.log('nothing from firebase');
        CellLine.allCellLinesFB = [];
      }
    });
  });

  firebaseLocal.signin =function(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    // ...
  }).then(function(){
    console.log('signedin');
    FirebaseallCellLines.once('value', function(snapshot){
      CellLine.allCellLinesFB = snapshot.val();
    });
  });
}

  firebaseLocal.register = function(email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      $('#sign-up .errors').empty();
      $('#sign-up .errors').text(errorMessage);
      console.log(errorCode, errorMessage);
    }).then(function(snapshot){
      console.log(snapshot.uid);
      var user = snapshot;
      firebase.database().ref('users/' + user.uid).set({
        username: user.displayName,
        email: user.email,
        uid: user.uid
      });

    });
  };




  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('.user-forms').addClass('displayoff');
      $('.current-user').removeClass('displayoff');
      $('.current-user h4').text('Signed in as: ' + user.email);
    } else {
      $('#sign-in').removeClass('displayoff');
    }
  });

  firebaseLocal.signOut = function(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }, function(error) {
    // An error happened.
    });
  };

  module.firebaseLocal = firebaseLocal;
})(window);
