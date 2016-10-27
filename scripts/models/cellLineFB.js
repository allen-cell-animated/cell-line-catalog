(function(module) {

  FirebaseRef = firebase.database();
  FirebaseallCellLines = FirebaseRef.ref('/celllines');
// Create a root reference
  FirebaseRef.storageRef = firebase.storage().ref();

  FirebaseRef.signinHandler = function(){
    $('#sign-in').submit(signin);
    function signin() {
      event.preventDefault();
      var email    = $('#sign-in #username').val();
      var password = $('#sign-in #password').val();
      FirebaseRef.signin(email, password);
    }
  };

  FirebaseRef.signin =function(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    // ...
    }).then(function(){console.log('signedin');});
  };


  FirebaseRef.register = function(email, password){
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

  FirebaseRef.registerHandler = function(){
    $('#sign-up').submit(signup);
    function signup() {
      event.preventDefault();
      var email    = $('#sign-up #username').val();
      var password = $('#sign-up #password').val();
      var color = $('#sign-up #robot-test').val();
      if (color === 'purple') {
        console.log('registering user', email);
        FirebaseRef.register(email, password);
      }
      else{
        $('#sign-up .errors').empty();
        $('#sign-up .errors').text('Sorry, please answer question correctly');
      }
    }
  };

  FirebaseRef.signinRegisterSwitch = function(){
    $('#new-user').on('click', function(){
      $('#sign-in').addClass('displayoff');
      $('#sign-up').removeClass('displayoff');
    });
  };

  FirebaseRef.signOutHandler = function(){
    $('#signout').on('click', function(){
      $('.current-user h4').empty();
      $('.current-user').addClass('displayoff');
      FirebaseRef.signOut();
    })
  }

  FirebaseRef.signOut = function(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }, function(error) {
    // An error happened.
    });
  }



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
      $('#sign-in').removeClass('displayoff')
    }
  });


  FirebaseRef.signOutHandler();
  FirebaseRef.registerHandler();
  FirebaseRef.signinRegisterSwitch();
  FirebaseRef.signinHandler();
  module.FirebaseRef = FirebaseRef;
})(window);
