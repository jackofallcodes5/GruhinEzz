// Stop words to exclude from keyword generation
const STOP_WORDS = new Set([
  'a','an','the','is','it','in','of','and','or','for','to','with',
  'from','by','on','at','as','be','has','had','was','are','were',
  'but','not','this','that','they','their','there','have','will',
  'can','my','your','our','we','he','she','his','her','its','do',
  'did','does','made','make','into','than','then','when','all','also',
  'each','very','just','been','more','most','other','some','such','no',
  'up','out','if','about','who','which','me','him','them','what','so',
]);

/**
 * generateKeywords(title, description)
 * Produces a lowercase, deduplicated, stop-word-free space-separated
 * keyword string from a product title and description.
 * Used to populate the products.keywords column.
 */
function generateKeywords(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  const tokens = text
    .replace(/[^a-z0-9\s]/g, ' ') // strip punctuation
    .split(/\s+/)                     // split on whitespace
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t)); // filter short/stop words

  // Deduplicate while preserving order
  const seen = new Set();
  const unique = [];
  for (const token of tokens) {
    if (!seen.has(token)) {
      seen.add(token);
      unique.push(token);
    }
  }
  return unique.join(' ');
}

module.exports = { generateKeywords };
