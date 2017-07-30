import creds from '../../creds/gcloud.json';

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

const analyze = ({ ...args }) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'object' || !window.gapi) {
      reject('Error loading gapi');
    }
    else if (
      window.gapi.client
      && window.gapi.client.language
    ) {
      // we gucci
      // https://developers.google.com/apis-explorer/#p/language/v1/
      console.log('Yooooo dope');
      resolve();
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
