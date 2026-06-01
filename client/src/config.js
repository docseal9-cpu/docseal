import { Capacitor } from '@capacitor/core';

export const API_BASE = Capacitor.isNativePlatform() ? 'https://pdd-ma4k.onrender.com' : '';
