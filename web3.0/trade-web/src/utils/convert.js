/**
 * Owner: borden@kupotech.com
 */
export function checkTransferables(worker) {
  // let support = false;
  // const ab = str2ab(JSON.stringify('test'));
  // worker.postMessage(ab, [ab]);
  // if (ab.byteLength) {
  //   support = false;
  //   console.log('Transferables are not supported.');
  // } else {
  //   support = true;
  //   console.log('Transferables are supported.');
  // }
  // return support;
  // 转换为 Transferables ArrayBuffer，会带来额外的开销，得不偿失
  // 未来当高级特性普及后，再开启优化
  return false;
}

// source: http://stackoverflow.com/a/11058858
export function ab2str(buf) {
  let binaryString = '';
  const bytes = new Uint16Array(buf);
  for (let i = 0, length = bytes.length; i < length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
}

// source: http://stackoverflow.com/a/11058858
export function str2ab(str) {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
