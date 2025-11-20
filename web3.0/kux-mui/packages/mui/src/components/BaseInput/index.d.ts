/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

export interface IBaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

declare const BaseInput: React.ForwardRefRenderFunction<HTMLInputElement, IBaseInputProps>;

export default BaseInput;
