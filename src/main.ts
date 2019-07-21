type Parameter = {
  text: string;
};

function doPost(
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput {
  const param = e.parameter as Parameter;

  // ここでリクエストが自分のslackからのものかチェックしたいが、
  // tokenはdeprecatedかつheaderもdoPostでは取れないので厳しい

  const [power, time, type] = param.text.split(' ');

  const response = {
    text: `power: ${power}, time: ${time}, type: ${type}`,
  };
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}
