const fs = require('fs');

async function makeDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) reject(err);
      resolve(path);
    });
  });
}

async function readFile(path, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding ? encoding : null, function (error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
}

async function copyFile(path, savePath) {
  return new Promise((resolve, reject) => {
    fs.copyFile(path, savePath, () => {
      resolve(savePath);
    });
  });
}

async function saveFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, function (error) {
      if (error) reject(error);
      resolve(null);
    });
  });
}

async function deleteFile(path) {
  return new Promise((resolve, reject) => {
    if (!path || path == '') return resolve(path);
    fs.unlink(path, (error) => {
      // if (error) reject(error);
      resolve(path);
    });
  });
}

async function exists(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (error, stats) => {
      if (error) {
        resolve(error);
      } else {
        resolve();
      }
    });
  });
}

function createReadStream(fileName) {
  return fs.createReadStream(fileName);
}

exports.deleteFile = deleteFile;
exports.makeDirectory = makeDirectory;
exports.saveFile = saveFile;
exports.readFile = readFile;
exports.copyFile = copyFile;
exports.exists = exists;
exports.createReadStream = createReadStream;

function getExtension(fileName) {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(fileName)[1];
  return ext;
}
exports.getExtension = getExtension;

const dangerousFileTypes = [
  'ACTION',
  'APP',
  'BIN',
  'COM',
  'CPL',
  'EXE',
  'INF1',
  'INX',
  'ISU',
  'JSE',
  'LNK',
  'MSI',
  'MST',
  'OUT',
  'PIF',
  'PS1',
  'RGS',
  'SCR',
  'SHB',
  'U3P',
  'VBE',
  'VBSCRIPT',
  'WS',
  'WSH',
  '73K',
  '89K',
  'A6P',
  'AC',
  'ACC',
  'ACR',
  'ACTM',
  'AHK',
  'AIR',
  'APP',
  'ARSCRIPT',
  'AS',
  'ASB',
  'AWK',
  'AZW2',
  'BEAM',
  'BTM',
  'CEL',
  'CELX',
  'CHM',
  'COF',
  'CRT',
  'DEK',
  'DLD',
  'DMC',
  'DOCM',
  'DOTM',
  'DXL',
  'EAR',
  'EBM',
  'EBS',
  'EBS2',
  'ECF',
  'EHAM',
  'ELF',
  'ES',
  'EX4',
  'EXOPC',
  'EZS',
  'FAS',
  'FKY',
  'FPI',
  'FRS',
  'FXP',
  'GS',
  'HAM',
  'HMS',
  'HPF',
  'HTA',
  'IIM',
  'IPF',
  'ISP',
  'JAR',
  'JS',
  'JSX',
  'KIX',
  'LO',
  'LS',
  'MAM',
  'MCR',
  'MEL',
  'MPX',
  'MRC',
  'MS',
  'MS',
  'MXE',
  'NEXE',
  'OBS',
  'ORE',
  'OTM',
  'PEX',
  'PLX',
  'POTM',
  'PPAM',
  'PPSM',
  'PPTM',
  'PRC',
  'PVD',
  'PWC',
  'PYC',
  'PYO',
  'QPX',
  'RBX',
  'ROX',
  'RPJ',
  'S2A',
  'SBS',
  'SCA',
  'SCAR',
  'SCB',
  'SCRIPT',
  'SMM',
  'SPR',
  'TCP',
  'THM',
  'TLB',
  'TMS',
  'UDF',
  'UPX',
  'URL',
  'VLX',
  'VPM',
  'WCM',
  'WIDGET',
  'WIZ',
  'WPK',
  'PKG',
  'DMG',
  'COMMAND',
  'WPM',
  'XAP',
  'XBAP',
  'APK',
  'XLAM',
  'XLM',
  'XLSM',
  'XLTM',
  'XQT',
  'XYS',
  'ZL9',
];
exports.dangerousFileTypes = dangerousFileTypes;
