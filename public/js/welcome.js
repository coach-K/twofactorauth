$(document).ready(() => {
  var secretString = localStorage.getItem('secret_welcome');
  if (!secretString) {
    return;
  }
  var secret = JSON.parse(secretString);
  $('#welcomeMessage').html(`Welcome to your account ${secret.fullname}`);
  //localStorage.removeItem('secret_welcome');
})
