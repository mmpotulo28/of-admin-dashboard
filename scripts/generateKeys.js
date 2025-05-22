const fs = require('fs');
const crypto = require('crypto');

// Generate a key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Key size in bits
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// Save the public key to a file
fs.writeFileSync('./publicKey.pem', publicKey);
console.log('Public key saved to publicKey.pem');

// Save the private key to a file
fs.writeFileSync('./privateKey.pem', privateKey);
console.log('Private key saved to privateKey.pem');
