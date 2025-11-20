/**
 * Owner: eli.xiang@kupotech.com
 */
/**
 * 本文件为https://github.com/github/webauthn-json打包后的文件，原npm包要求 nodejs >= 18，为支持 nodejs14 ，直接拷贝文件使用
 * 原文件名 webauthn-json.browser-ponyfill.extended.js
 */






// src/webauthn-json/base64url.ts

function base64urlToBuffer(baseurl64String) {
  const padding = '=='.slice(0, (4 - (baseurl64String.length % 4)) % 4);
  const base64String = baseurl64String.replace(/-/g, '+').replace(/_/g, '/') + padding;
  const str = atob(base64String);
  const buffer = new ArrayBuffer(str.length);
  const byteView = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    byteView[i] = str.charCodeAt(i);
  }
  return buffer;
}
function bufferToBase64url(buffer) {
  const byteView = new Uint8Array(buffer);
  let str = '';
  for (const charCode of byteView) {
    str += String.fromCharCode(charCode);
  }
  const base64String = btoa(str);
  const base64urlString = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return base64urlString;
}

function base64UrlToBase64(base64UrlString) {
  // 将 Base64 URL 编码字符串中的 '-' 替换为 '+'
  let base64String = base64UrlString.replace(/-/g, '+');

  // 将 Base64 URL 编码字符串中的 '_' 替换为 '/'
  base64String = base64String.replace(/_/g, '/');

  // 计算需要添加的填充字符 '=' 的数量
  const padding = base64String.length % 4;
  if (padding > 0) {
    base64String += '='.repeat(4 - padding);
  }

  return base64String;
}

// src/webauthn-json/convert.ts
const copyValue = 'copy';
const convertValue = 'convert';
function convert(conversionFn, schema2, input) {
  if (schema2 === copyValue) {
    return input;
  }
  if (schema2 === convertValue) {
    return conversionFn(input);
  }
  if (schema2 instanceof Array) {
    return input.map((v) => convert(conversionFn, schema2[0], v));
  }
  if (schema2 instanceof Object) {
    const output = {};
    for (const [key, schemaField] of Object.entries(schema2)) {
      if (schemaField.derive) {
        const v = schemaField.derive(input);
        if (v !== void 0) {
          input[key] = v;
        }
      }
      if (!(key in input)) {
        if (schemaField.required) {
          throw new Error(`Missing key: ${key}`);
        }
        continue;
      }
      if (input[key] == null) {
        output[key] = null;
        continue;
      }
      output[key] = convert(conversionFn, schemaField.schema, input[key]);
    }
    return output;
  }
}
function derived(schema2, derive) {
  return {
    required: true,
    schema: schema2,
    derive,
  };
}
function required(schema2) {
  return {
    required: true,
    schema: schema2,
  };
}
function optional(schema2) {
  return {
    required: false,
    schema: schema2,
  };
}

// src/webauthn-json/basic/schema.ts
const publicKeyCredentialDescriptorSchema = {
  type: required(copyValue),
  id: required(convertValue),
  transports: optional(copyValue),
};
const simplifiedExtensionsSchema = {
  appid: optional(copyValue),
  appidExclude: optional(copyValue),
  credProps: optional(copyValue),
};
const simplifiedClientExtensionResultsSchema = {
  appid: optional(copyValue),
  appidExclude: optional(copyValue),
  credProps: optional(copyValue),
};
const credentialCreationOptions = {
  publicKey: required({
    rp: required(copyValue),
    user: required({
      id: required(convertValue),
      name: required(copyValue),
      displayName: required(copyValue),
    }),
    challenge: required(convertValue),
    pubKeyCredParams: required(copyValue),
    timeout: optional(copyValue),
    excludeCredentials: optional([publicKeyCredentialDescriptorSchema]),
    authenticatorSelection: optional(copyValue),
    attestation: optional(copyValue),
    extensions: optional(simplifiedExtensionsSchema),
  }),
  signal: optional(copyValue),
};
const publicKeyCredentialWithAttestation = {
  type: required(copyValue),
  id: required(copyValue),
  rawId: required(convertValue),
  authenticatorAttachment: optional(copyValue),
  response: required({
    clientDataJSON: required(convertValue),
    attestationObject: required(convertValue),
    transports: derived(copyValue, (response) => {
      let _a;
      return ((_a = response.getTransports) == null ? void 0 : _a.call(response)) || [];
    }),
  }),
  clientExtensionResults: derived(simplifiedClientExtensionResultsSchema, (pkc) =>
    pkc.getClientExtensionResults(),
  ),
};
const credentialRequestOptions = {
  mediation: optional(copyValue),
  publicKey: required({
    challenge: required(convertValue),
    timeout: optional(copyValue),
    rpId: optional(copyValue),
    allowCredentials: optional([publicKeyCredentialDescriptorSchema]),
    userVerification: optional(copyValue),
    extensions: optional(simplifiedExtensionsSchema),
  }),
  signal: optional(copyValue),
};
const publicKeyCredentialWithAssertion = {
  type: required(copyValue),
  id: required(copyValue),
  rawId: required(convertValue),
  authenticatorAttachment: optional(copyValue),
  response: required({
    clientDataJSON: required(convertValue),
    authenticatorData: required(convertValue),
    signature: required(convertValue),
    userHandle: required(convertValue),
  }),
  clientExtensionResults: derived(simplifiedClientExtensionResultsSchema, (pkc) =>
    pkc.getClientExtensionResults(),
  ),
};

// src/webauthn-json/basic/supported.ts
function passkeysSupported() {
  return !!(
    navigator.credentials &&
    navigator.credentials.create &&
    navigator.credentials.get &&
    window.PublicKeyCredential
  );
}

// src/webauthn-json/extended/schema.ts
const authenticationExtensionsClientInputsSchema = {
  appid: optional(copyValue),
  appidExclude: optional(copyValue),
  uvm: optional(copyValue),
  credProps: optional(copyValue),
  largeBlob: optional({
    support: optional(copyValue),
    read: optional(copyValue),
    write: optional(convertValue),
  }),
};
const authenticationExtensionsClientOutputsSchema = {
  appid: optional(copyValue),
  appidExclude: optional(copyValue),
  uvm: optional(copyValue),
  credProps: optional(copyValue),
  largeBlob: optional({
    supported: optional(copyValue),
    blob: optional(convertValue),
    written: optional(copyValue),
  }),
};
const credentialCreationOptionsExtended = JSON.parse(JSON.stringify(credentialCreationOptions));
credentialCreationOptionsExtended.publicKey.schema.extensions = optional(
  authenticationExtensionsClientInputsSchema,
);
const publicKeyCredentialWithAttestationExtended = JSON.parse(
  JSON.stringify(publicKeyCredentialWithAttestation),
);
publicKeyCredentialWithAttestationExtended.clientExtensionResults = derived(
  authenticationExtensionsClientOutputsSchema,
  publicKeyCredentialWithAttestation.clientExtensionResults.derive,
);
publicKeyCredentialWithAttestationExtended.response.schema.transports =
  publicKeyCredentialWithAttestation.response.schema.transports;
const credentialRequestOptionsExtended = JSON.parse(JSON.stringify(credentialRequestOptions));
credentialRequestOptionsExtended.publicKey.schema.extensions = optional(
  authenticationExtensionsClientInputsSchema,
);
const publicKeyCredentialWithAssertionExtended = JSON.parse(
  JSON.stringify(publicKeyCredentialWithAssertion),
);
publicKeyCredentialWithAssertionExtended.clientExtensionResults = derived(
  authenticationExtensionsClientOutputsSchema,
  publicKeyCredentialWithAssertion.clientExtensionResults.derive,
);

// src/webauthn-json/extended/api.ts
function createExtendedRequestFromJSON(requestJSON) {
  return convert(base64urlToBuffer, credentialCreationOptionsExtended, requestJSON);
}
function createExtendedResponseToJSON(credential) {
  return convert(bufferToBase64url, publicKeyCredentialWithAttestationExtended, credential);
}
// function getExtendedRequestFromJSON(requestJSON) {
//   return convert(base64urlToBuffer, credentialRequestOptionsExtended, requestJSON);
// }
// function getExtendedResponseToJSON(credential) {
//   return convert(bufferToBase64url, publicKeyCredentialWithAssertionExtended, credential);
// }

// src/webauthn-json/browser-ponyfill.extended.ts
async function createExtended2(options) {
  try {
    const response = await navigator.credentials.create(options);
    response.toJSON = () => createExtendedResponseToJSON(response);
    return response;
  } catch (error) {
    console.error('createExtended2 error:', error);
  }
}
// async function getExtended2(options) {
//   const response = await navigator.credentials.get(options);
//   response.toJSON = () => getExtendedResponseToJSON(response);
//   return response;
// }
export {
  createExtended2 as createExtended,
  // getExtended2 as getExtended,
  createExtendedRequestFromJSON as parseExtendedCreationOptionsFromJSON,
  // getExtendedRequestFromJSON as parseExtendedRequestOptionsFromJSON,
  passkeysSupported,
  base64UrlToBase64,
  base64urlToBuffer,
  bufferToBase64url,
};
// # sourceMappingURL=webauthn-json.browser-ponyfill.extended.js.map
