const form = document.querySelector('form');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
const errorMessage = document.querySelector('.error-message');

form.addEventListener('submit', (event) => {
  if (password.value !== confirmPassword.value) {
    errorMessage.style.display = 'block';
    errorMessage.style.color = 'red';
    errorMessage.style.fontWeight = '400';
    form.style.textAlign = 'center';
    event.preventDefault();
  }
});

password.addEventListener('input', () => {
  errorMessage.style.display = 'none';
});

confirmPassword.addEventListener('input', () => {
  errorMessage.style.display = 'none';
});

form.addEventListener('reset', () => {
  errorMessage.style.display = 'none';
  form.style.textAlign = '';
});
