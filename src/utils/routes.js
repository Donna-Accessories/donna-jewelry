// src/utils/routes.js
const BASE_URL = '/donna-jewelry';

export const routes = {
  home: `${BASE_URL}/`,
  products: `${BASE_URL}/products`,
  productDetail: (id) => `${BASE_URL}/products/${id}`,
  category: (category) => `${BASE_URL}/products?category=${category}`,
  about: `${BASE_URL}/about`,
  admin: `${BASE_URL}/admin`,
};

export default routes;
