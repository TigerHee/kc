import IndexDbStorage from './IndexDbStorage';

export const brandStoreKey = 'brand_info';

export const brandDbStore = new IndexDbStorage('brand_db', 'brand_store', brandStoreKey);
