$(document).ready(() => {
  $('#signupForm').submit((e) => {
    e.preventDefault();

    if ($('#fullname').val().length < 2 || $('#fullname').val().length > 255) {
      $('#signupMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> Invalid Full Name.</div>');
    }

    $('#signupButton').html('Loading...');
    var values = {};
    $.each($('#signupForm').serializeArray(), (i, field) => {
      values[field.name] = field.value;
    });
    console.log(values);
    console.log(JSON.stringify(values));

    fetch(`${getBaseUrl()}register`, {
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
        localStorage.setItem('secret', resString);
        window.location = '/verify.html';
      } else {
        $('#signupButton').html('Signup');
        $('#signupMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button>User already exist.</div>');
      }
    })
    .catch(error => {
      $('#signupButton').html('Signup');
      console.error(error);
    })
  });
})
