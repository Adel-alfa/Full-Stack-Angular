
export interface Category {
    id: number;
    name: string;
    products?: Product[];
}

import { Product } from '../interfaces/product'