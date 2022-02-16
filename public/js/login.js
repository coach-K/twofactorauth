$(document).ready(() => {
  $('#loginForm').submit((e) => {
    e.preventDefault();

    $('#loginButton').html('Loading...');
    var values = {};
    $.each($('#loginForm').serializeArray(), (i, field) => {
      values[field.name] = field.value;
    });
    console.log(values);
    console.log(JSON.stringify(values));

    fetch(`${getBaseUrl()}login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.status) {
        var resString = JSON.stringify(res);
        localStorage.setItem('secret_login', resString);
        window.location = '/validate.html';
      } else {
        $('#loginButton').html('Login');
        $('#loginMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>Invalid Email or Password.</div>');
      }
    })
    .catch(error => {
      $('#loginButton').html('Login');
      console.error(error);
    })
  });
})
