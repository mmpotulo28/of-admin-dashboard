const buildDir = path.join(__dirname, '.next');

/**
 * Cleans the .next build directory.
 */
function cleanBuildDirectory() {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
    console.log('.next build directory cleaned.');
  } else {
    console.log('.next build directory does not exist.');
  }
}

cleanBuildDirectory();
