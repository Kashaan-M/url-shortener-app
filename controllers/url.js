const Url = require('../models/Url');
const validUrl = require('valid-url');
const generateNum = () => {
  // a simple random number generator function which generates number less than one million
  return Math.floor(Math.random() * 1000000);
};

const setUrl = async (req, res) => {
  // 1 - validate url
  // 2 - check if original url exists. if does return short from database
  // 3 - if short not exists generateNum
  // 4 - check if generateNum already exists then regenerateNum(recursive)
  // 5 - finally save generateNum as short in database

  // step 1
  if (!validUrl.isUri(req.body.url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  // step 2
  const docs = await Url.find({ original: req.body.url });
  if (docs.length === 1) {
    // destructuring array and below that destructuring obj
    const [obj] = docs;
    // here original_url and short_url are aliases for original and short properties in the 'urls' collection
    const { original: original_url, short: short_url } = obj;
    return res.status(200).json({ original_url, short_url: Number(short_url) });
  }
  // step 3
  else {
    console.log('second');
    let genShort = generateNum();
    async function isShortExists(short) {
      const exists = await Url.find({ short: genShort });
      if (exists.length > 0 && exists.length < 1) {
        genShort = generateNum();
        // step 4
        isShortExists(genShort);
      }
      return false;
    }
    // step 5
    if (!(await isShortExists(genShort))) {
      console.log('third');
      const doc = await Url.create({ original: req.body.url, short: genShort });
      return res.status(200).json({ original_url: doc.original, short_url: Number(doc.short) });
    }
  }
};

const getOriginal = async (req, res) => {
  // 1 - check if document with given short_url exists
  const doc = await Url.find({ short: req.params.short });
  // 2 - if no document with given shor_url exists
  if (doc.length === 0) {
    return res.status(400).json({ msg: 'No shortened Url exists for this' });
  }
  // 3 - if document exists, destructure and redirect to original_url
  const [obj] = doc;

  const { original: original_url, short: short_url } = obj;
  res.redirect(original_url);
};

module.exports = { setUrl, getOriginal };
