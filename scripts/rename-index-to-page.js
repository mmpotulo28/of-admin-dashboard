const appDir = path.join(__dirname, 'src', 'app');

/**
 * Renames 'index.tsx' files to 'page.tsx' within a directory and its subdirectories.
 *
 * @param {string} dir - The directory path to start renaming files.
 */
function renameIndexFiles(dir) {
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
          renameIndexFiles(filePath);
        } else if (stats.isFile() && file === 'index.tsx') {
          const newFilePath = path.join(dir, 'page.tsx');
          fs.rename(filePath, newFilePath, (renameErr) => {
            if (renameErr) {
              console.error(
                `Error renaming file ${filePath} to ${newFilePath}:`,
                renameErr
              );
            } else {
              console.log(`Renamed ${filePath} to ${newFilePath}`);
            }
          });
        }
      });
    });
  });
}

renameIndexFiles(appDir);
