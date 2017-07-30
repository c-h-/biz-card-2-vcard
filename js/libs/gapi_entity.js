import creds from '../../creds/gcloud.json';
import { checkStatus, parseJSON } from './reqHelpers';

const CLIENT_ID = creds.client_id;
const API_KEY = creds.api_key;
const SCOPES = 'https://www.googleapis.com/auth/cloud-platform';
const API_VERSION = 'v1';

/**
* Load the Google Natural Language API.
*/
function initializeApi() {
  window.gapi.client.load('language', API_VERSION);
}

/**
* Authorize Google Natural Language API.
*/
function authorization() {
  console.log('autorhisss');
  window.gapi.client.setApiKey(API_KEY);
  window.gapi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false,
  }, (authResult) => {
    if (authResult && !authResult.error) {
      console.log('G Auth was successful!');
      initializeApi();
    }
    else {
      console.log('Auth was not successful');
    }
  });
}

const analyze = (OCRResults) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'object' || !window.gapi) {
      reject('Error loading gapi');
    }
    else if (
      window.gapi.client
      && window.gapi.client.language
    ) {
      let textBody = [];
      if (OCRResults && OCRResults.ParsedResults) {
        textBody = OCRResults.ParsedResults.map(result => (result.ParsedText || ''))
      }
      if (!OCRResults || textBody.length === 0) {
        reject('Error with OCR text');
      }
      // we gucci
      // https://developers.google.com/apis-explorer/#p/language/v1/
      console.log('Yooooo dope');
      window.gapi.client.language.documents.analyzeEntities({
        document: {
          content: textBody.join(' '),
          type: 'PLAIN_TEXT',
        },
      })
      .then(checkStatus)
      .then(parseJSON)
      .then((results) => {
        console.log('Entity Results', results);
        // const entities = results.entities;

        // console.log('Entities:');
        // entities.forEach((entity) => {
        //   console.log(entity.name);
        //   console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        //   if (entity.metadata && entity.metadata.wikipedia_url) {
        //     console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
        //   }
        // });
        resolve(results);
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reject(err);
      });
    }
    else {
      reject('Error loading gapi language client');
    }
  });
};

const init = authorization;

export {
  analyze,
  init,
};
