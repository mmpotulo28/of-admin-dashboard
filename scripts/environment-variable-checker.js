const requiredEnvVars = ['API_KEY', 'DB_HOST', 'DB_USER', 'DB_PASS'];

/**
 * Checks for required environment variables.
 */
function checkEnvVars() {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
    process.exit(1);
  } else {
    console.log('All required environment variables are set.');
  }
}

checkEnvVars();
