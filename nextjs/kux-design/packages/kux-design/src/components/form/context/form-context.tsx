/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { IFormContextValue, IFormNoStyleItemContextValue } from '../types';

export const FormContext = React.createContext<IFormContextValue>({});

export const FormNoStyleItemContext = React.createContext<IFormNoStyleItemContextValue>({}); 