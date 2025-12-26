/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AmazonService {

    // search amazon products
    async searchProducts(query: string) {
        // Implement Amazon scraping logic here
        return [
            {
                platform: 'amazon',
                title: 'Apple iPhone 13 128GB',
                price: '₦760000',
                images: ['https://images-na.ssl-images-amazon.com/...'],
                url: 'https://amazon.com/dp/...'
            }
        ];
    }
}
