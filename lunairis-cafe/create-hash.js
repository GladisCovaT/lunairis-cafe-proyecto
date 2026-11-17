const bcrypt = require('bcrypt');

const passwordPlainText = 'TuPasswordAdmin123'; // Cambia esto por tu contraseña

bcrypt.hash(passwordPlainText, 10, (err, hash) => {
  if (err) throw err;
  console.log('--- COPIA ESTE HASH ---');
  console.log(hash);
  console.log('------------------------');
});