const sourceDir = path.join(__dirname, 'src');
const destDir = path.join(__dirname, 'public', 'images');

/**
 * Copies image files from source directory to destination directory.
 *
 * @param {string} dir - The directory path to start copying files.
 */
function copyImageFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats of file ${filePath}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          copyImageFiles(filePath);
        } else if (stats.isFile() && /\.(jpg|jpeg|png|gif|svg)$/i.test(file)) {
          const destFile = path.join(destDir, file);
          fs.copyFile(filePath, destFile, (copyErr) => {
            if (copyErr) {
              console.error(
                `Error copying file ${filePath} to ${destFile}:`,
                copyErr
              );
            } else {
              console.log(`Copied ${filePath} to ${destFile}`);
            }
          });
        }
      });
    });
  });
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

copyImageFiles(sourceDir);
