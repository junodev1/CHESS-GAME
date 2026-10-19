// Compatibility utilities for older WebViews
// deepClone: fallback using JSON for plain data
function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}
// Polyfill structuredClone if not present
if(typeof structuredClone !== 'function'){
  window.structuredClone = deepClone;
}
