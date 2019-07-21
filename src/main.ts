type Parameter = {
  text: string;
};

function doPost(
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput {
  const param = e.parameter as Parameter;
  const [isValid, errorMessage] = validateRequest(param);
  if (!isValid) {
    const response = { text: errorMessage };
    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const [power, time, type] = param.text.split(' ').map(s => s.toLowerCase());

  const response = {
    text: `power: ${power}, time: ${time}, type: ${type}`,
  };
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}

const validateRequest = (param: Parameter): [boolean, string] => {
  // ここでリクエストが自分のslackからのものかチェックしたいが、
  // tokenはdeprecatedかつheaderもdoPostでは取れないので厳しい
  const power = param.text.split(' ')[0].toLowerCase();
  if (power != 'on' && power != 'off') {
    return [false, 'Invalid parameter'];
  }
  return [true, ''];
};
