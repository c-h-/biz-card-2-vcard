
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  if (response.json) {
    return response.json();
  }
  else if (response.body) {
    let result = null;
    try {
      result = JSON.parse(response.body);
    }
    catch (e) {
      return result;
    }
    return result;
  }
  else {
    return null;
  }
}

export {
  checkStatus,
  parseJSON,
};
