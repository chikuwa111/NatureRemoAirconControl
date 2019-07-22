import * as dayjs from 'dayjs';

type Parameter = {
  text: string;
};

function doPost(
  e: GoogleAppsScript.Events.DoPost
): GoogleAppsScript.Content.TextOutput {
  // リクエストが自分のslackからのものかチェックしたいが、
  // tokenはdeprecatedかつheaderもdoPostでは取れないので厳しい

  let text = '';
  try {
    const param = e.parameter as Parameter;
    const [action, datetime] = param.text.split(' ').map(s => s.toLowerCase());
    text = execPostAction(action, datetime);
  } catch (err) {
    text = err.message;
  }
  if (text == '') text = 'unexpected error occurred';
  text = `NatureRemoAirconControl: ${text}`;
  return ContentService.createTextOutput(JSON.stringify({ text })).setMimeType(
    ContentService.MimeType.JSON
  );
}

function cron() {
  const properties = PropertiesService.getScriptProperties();
  const onDatetime = properties.getProperty('onDatetime');
  const offDatetime = properties.getProperty('offDatetime');

  if (onDatetime != null && dayjs().isAfter(dayjs(onDatetime))) {
    const text = on();
    console.log(text);
  }
  if (offDatetime != null && dayjs().isAfter(dayjs(offDatetime))) {
    const text = off();
    console.log(text);
  }
}

const execPostAction = (action: string, datetime: string): string => {
  switch (action) {
    case 'list':
      return list();
    case 'reset':
      return reset();
    case 'on':
      if (datetime == null) return on();
      else return registerOn(datetime);
    case 'off':
      if (datetime == null) return off();
      else return registerOff(datetime);
    default:
      throw new Error('unexpected action');
  }
};

const list = (): string => {
  const properties = PropertiesService.getScriptProperties();
  const onDatetime = properties.getProperty('onDatetime');
  const offDatetime = properties.getProperty('offDatetime');
  return `onDatetime=${onDatetime},offDatetime=${offDatetime}`;
};

const reset = (): string => {
  const properties = PropertiesService.getScriptProperties();
  properties.deleteProperty('onDatetime');
  properties.deleteProperty('offDatetime');
  return 'successfully reset.';
};

const registerOn = (datetime: string): string => {
  if (!dayjs(datetime).isValid()) {
    throw new Error('datetime is invalid.');
  }
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('onDatetime', datetime);
  return 'successfully registered.';
};

const registerOff = (datetime: string): string => {
  if (!dayjs(datetime).isValid()) {
    throw new Error('datetime is invalid.');
  }
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('offDatetime', datetime);
  return 'successfully registered.';
};

const on = (): string => {
  const properties = PropertiesService.getScriptProperties();
  const powerOnSignalId = properties.getProperty('powerOnSignalId');
  if (powerOnSignalId == null) {
    throw new Error('powerOnSignalId is not defined.');
  }
  const res = sendSignal(powerOnSignalId);
  if (res.getResponseCode() !== 200) {
    throw new Error(
      `failed to send on signal. (status: ${res.getResponseCode()})`
    );
  }
  return 'successfully sent on signal.';
};

const off = (): string => {
  const properties = PropertiesService.getScriptProperties();
  const powerOffSignalId = properties.getProperty('powerOffSignalId');
  if (powerOffSignalId == null) {
    throw new Error('powerOffSignalId is not defined.');
  }
  const res = sendSignal(powerOffSignalId);
  if (res.getResponseCode() !== 200) {
    throw new Error(
      `failed to send off signal. (status: ${res.getResponseCode()})`
    );
  }
  return 'successfully sent off signal.';
};

const sendSignal = (
  signalId: string
): GoogleAppsScript.URL_Fetch.HTTPResponse => {
  const properties = PropertiesService.getScriptProperties();
  const token = properties.getProperty('token');
  if (token == null) {
    throw new Error('token is not defined.');
  }

  const url = `https://api.nature.global/1/signals/${signalId}/send`;
  const params = {
    method: 'post' as const,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const res = UrlFetchApp.fetch(url, params);
  return res;
};
