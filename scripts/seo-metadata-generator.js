const configPath = path.join(__dirname, 'seo-config.json');
const outputPath = path.join(__dirname, 'src', 'seo-metadata.js');

/**
 * Generates SEO metadata based on a configuration file.
 */
function generateSeoMetadata() {
  if (!fs.existsSync(configPath)) {
    console.error(`Configuration file ${configPath} does not exist.`);
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const metadata = config.pages.map((page) => {
    return `{
      path: '${page.path}',
      title: '${page.title}',
      description: '${page.description}',
      keywords: '${page.keywords.join(', ')}'
    }`;
  });

  const outputCode = `export const seoMetadata = [
    ${metadata.join(',\n')}
  ];
  `;

  fs.writeFileSync(outputPath, outputCode);
  console.log(`SEO metadata generated at ${outputPath}`);
}

generateSeoMetadata();
