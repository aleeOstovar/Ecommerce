const translate = require('translate');

async function translateValue(value, fromLang, toLang) {
  const translationOptions = { from: fromLang, to: toLang };
  try {
    const translatedValue = await translate(value, translationOptions);
    return translatedValue;
  } catch (err) {
    throw new Error(`Translation failed for ${value}: ${err.message}`);
  }
}

module.exports = translateValue;
