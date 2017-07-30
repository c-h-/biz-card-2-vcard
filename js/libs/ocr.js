import ocrKey from '../../creds/ocr_key';
import { checkStatus, parseJSON } from './reqHelpers';

export default (base64Image) => {
  return new Promise((resolve, reject) => {
    const opts = {
      apikey: ocrKey,
      language: 'eng',
      isOverlayRequired: false,
      base64Image,
    };
    const form = new FormData();
    for (const key in opts) {
      form.append(key, opts[key]);
    }
    fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: form,
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((data) => {
        console.log('request succeeded with JSON response', data);
        resolve(data);
      })
      .catch((error) => {
        console.log('request failed', error);
        reject(error);
      });
  });
};
