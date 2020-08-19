const devBaseUrl = '';
// const devBaseUrl = 'http://crm.metujia.com';
const devProdUrl = 'http://crm.metujia.com';
const curBaseUrl = devBaseUrl || devProdUrl;

const loginBaseUrl = curBaseUrl;
const apiBaseUrl = curBaseUrl+'/api';

export default {loginBaseUrl, apiBaseUrl, curBaseUrl}


