$(document).ready(() => {
  var secretString = localStorage.getItem('secret_login');
  if (!secretString) {
    return;
  }
  var secret = JSON.parse(secretString);
  $('#email').val(secret.email);
  localStorage.removeItem('secret_login');

  $('#validateForm').submit((e) => {
    e.preventDefault();

    if ($('#token').val().length < 2) {
      $('#validateMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> Invalid Token</div>');
    }

    $('#validateButton').html('Loading...');
    var values = {};
    $.each($('#validateForm').serializeArray(), (i, field) => {
      values[field.name] = field.value;
    });
    console.log(values);

    fetch(`${getBaseUrl()}validate`, {
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
      if (res.validated) {
        window.location = '/welcome.html';
      } else {
        $('#validateButton').html('Validate');
        $('#validateMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> Invalid Token</div>');
      }
    })
    .catch(error => {
      $('#validateButton').html('Validate');
      console.error(error);
    })
  });
})
