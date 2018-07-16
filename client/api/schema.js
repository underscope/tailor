import request from './request';

function getSchemas() {
  return request.get('/schemas')
    .then(res => res.data);
}

export default {
  getSchemas
};
