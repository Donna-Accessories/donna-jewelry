// src/utils/debug.js

const DEBUG = import.meta.env.MODE === 'development';

export const debugLog = (component, action, data) => {
  if (!DEBUG) return;
  
  console.group(`🔍 ${component}`);
  console.log(`Action: ${action}`);
  if (data) console.log('Data:', data);
  console.groupEnd();
};

export const logError = (component, error, context = {}) => {
  console.error(`❌ Error in ${component}:`, error);
  if (Object.keys(context).length > 0) {
    console.error('Context:', context);
  }
};