// Generate a 256-bit (32-byte) cryptographically secure shared secret key
const crypto = require('crypto');

// Use crypto.randomBytes to generate a random 32-byte key and convert it to hexadecimal
// crypto.randomBytes is a secure method for generating random data
const secretKey = crypto.randomBytes(32).toString('hex');

// Ensure the key is exactly 64 characters long (32 bytes in hexadecimal)
if (secretKey.length !== 64) {
  throw new Error('Generated key is not 64 characters long');
}

// Output the securely generated shared secret key
console.log('Generated Shared Secret Key:', secretKey);
