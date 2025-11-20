import {
  createExtendedRequestFromJSON as parseExtendedCreationOptionsFromJSON,
  createExtendedResponseToJSON,
  CredentialCreationOptionsExtendedJSON,
  CredentialRequestOptionsExtendedJSON,
  getExtendedRequestFromJSON as parseExtendedRequestOptionsFromJSON,
  getExtendedResponseToJSON,
  PublicKeyCredentialWithAssertionExtendedResultsJSON as AuthenticationResponseExtendedJSON,
  PublicKeyCredentialWithAttestationExtendedResultsJSON as RegistrationResponseExtendedJSON,
  supported,
} from './extended/index';
import { base64UrlToBase64 } from './base64url'
export {
  parseExtendedCreationOptionsFromJSON,
  parseExtendedRequestOptionsFromJSON,
  supported as passkeysSupported,
  base64UrlToBase64,
};
export type {
  CredentialCreationOptionsExtendedJSON,
  CredentialRequestOptionsExtendedJSON,
  AuthenticationResponseExtendedJSON,
  RegistrationResponseExtendedJSON,
};

export interface RegistrationPublicKeyCredential extends PublicKeyCredential {
  toJSON(): RegistrationResponseExtendedJSON;
}

export async function createExtended(
  options: CredentialCreationOptions
): Promise<RegistrationPublicKeyCredential> {
  const response = (await navigator.credentials.create(
    options
  )) as RegistrationPublicKeyCredential;
  response.toJSON = () => createExtendedResponseToJSON(response);
  return response;
}

export interface AuthenticationPublicKeyCredential extends PublicKeyCredential {
  toJSON(): AuthenticationResponseExtendedJSON;
}

export async function getExtended(
  options: CredentialRequestOptions
): Promise<AuthenticationPublicKeyCredential> {
  const response = (await navigator.credentials.get(
    options
  )) as AuthenticationPublicKeyCredential;
  response.toJSON = () => getExtendedResponseToJSON(response);
  return response;
}
