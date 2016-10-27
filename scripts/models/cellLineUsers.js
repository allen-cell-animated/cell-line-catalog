(function(module) {
  cellLineUsers = {};
  cellLineUsers.signinHandler = function(){
    $('#sign-in').submit(signin);
    function signin() {
      event.preventDefault();
      var email    = $('#sign-in #username').val();
      var password = $('#sign-in #password').val();
      firebaseLocal.signin(email, password);
    }
  };

  cellLineUsers.registerHandler = function(){
    $('#sign-up').submit(signup);
    function signup() {
      event.preventDefault();
      var email    = $('#sign-up #username').val();
      var password = $('#sign-up #password').val();
      var color = $('#sign-up #robot-test').val();
      if (color === 'purple') {
        console.log('registering user', email);
        firebaseLocal.register(email, password);
      }
      else{
        $('#sign-up .errors').empty();
        $('#sign-up .errors').text('Sorry, please answer question correctly');
      }
    }
  };

  cellLineUsers.signinRegisterSwitch = function(){
    $('#new-user').on('click', function(){
      $('#sign-in').addClass('displayoff');
      $('#sign-up').removeClass('displayoff');
    });
  };

  cellLineUsers.signOutHandler = function(){
    $('#signout').on('click', function(){
      $('.current-user h4').empty();
      $('.current-user').addClass('displayoff');
      firebaseLocal.signOut();
    });
  };



  module.cellLineUsers = cellLineUsers;
})(window);
