import { Capacitor } from '@capacitor/core';

export const API_BASE = import.meta.env.PROD 
  ? 'https://pdd-ma4k.onrender.com' 
  : 'http://localhost:5000';
