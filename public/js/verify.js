$(document).ready(() => {
  var secretString = localStorage.getItem('secret');
  if (!secretString) {
    return;
  }
  var secret = JSON.parse(secretString);
  $('#barcodeImage').attr('src', secret.url);
  $('#email').val(secret.email);
  localStorage.removeItem('secret');

  $('#verifyForm').submit((e) => {
    e.preventDefault();

    if ($('#token').val().length < 2) {
      $('#verifyMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> Invalid Token</div>');
    }

    $('#verifyButton').html('Loading...');
    var values = {};
    $.each($('#verifyForm').serializeArray(), (i, field) => {
      values[field.name] = field.value;
    });
    console.log(values);

    fetch(`${getBaseUrl()}verify`, {
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
      if (res.verified) {
        localStorage.setItem('secret_welcome', JSON.stringify(res));
        window.location = '/welcome.html';
      } else {
        $('#verifyButton').html('Verify');
        $('#verifyMessage').html('<div class="alert alert-danger"><button type="button" class="close" data-dismiss="alert">&times;</button> Invalid Token</div>');
      }
    })
    .catch(error => {
      $('#verifyButton').html('Verify');
      console.error(error);
    })
  });
})
