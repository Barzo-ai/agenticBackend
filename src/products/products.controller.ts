/* eslint-disable prettier/prettier */
import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { }

    @Get('compare')
    compare(@Query('q') q: string) {
        // return q;
        return this.productsService.compare(q);
    }

    @Post('search')
    search(@Body('query') query: string) {
        return this.productsService.search(query);
    }
}
