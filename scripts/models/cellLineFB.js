(function(module) {

  firebaseLocal = firebase.database();
  FirebaseallCellLines = firebaseLocal.ref('/celllines');
  firebaseLocal.storageRef = firebase.storage().ref();


  firebaseLocal.signin =function(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    // ...
    }).then(function(){console.log('signedin');});
  };


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



  



  FirebaseallCellLines.on('value', function(snapshot) {
    if (snapshot.val()) {
      CellLine.allCellLinesFB = snapshot.val();
    }
    else {
      CellLine.allCellLinesFB = [];
    }
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $('.user-forms').addClass('displayoff');
      $('.current-user').removeClass('displayoff');
      $('.current-user h4').text('Signed in as: ' + user.email);
    } else {
      $('#sign-in').removeClass('displayoff');
    }
  });


  firebaseLocal.signOutHandler();
  firebaseLocal.registerHandler();
  firebaseLocal.signinRegisterSwitch();
  firebaseLocal.signinHandler();
  module.firebaseLocal = firebaseLocal;
})(window);
