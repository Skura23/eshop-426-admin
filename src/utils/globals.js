const devBaseUrl = 'http://crm.metujia.com';
const prodBaseUrl = location.origin;
const curBaseUrl = process.env.NODE_ENV=='development' ? devBaseUrl : prodBaseUrl;

const loginBaseUrl = curBaseUrl;
const apiBaseUrl = curBaseUrl + '/api';

console.log(process.env.NODE_ENV, curBaseUrl, 'process.env.NODE_ENV');

export default {loginBaseUrl, apiBaseUrl, curBaseUrl}


