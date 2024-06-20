import { Body, Controller, Get, Param, Patch, Post, UseInterceptors, Query, UsePipes, UseFilters, Delete } from '@nestjs/common';
import { MorganInterceptor } from 'src/modules/shared/interceptors/morgan.interceptor';
import { ProductsService, TProductListOptions } from '../services/products.service';
import { TProduct } from '../types';
import { FormatListArgsInterceptor } from 'src/modules/shared/interceptors/format-list-args.interceptor';
import { JoiValidationPipe } from 'src/modules/shared/pipes/joi-validation.pipe';
import { ProductsValidationService } from '../services/products-validation.service';

@UseInterceptors(MorganInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get(':id')
  single(@Param('id') id: string){
    return this.productsService.single(id);
  }

  @Get()
  @UseInterceptors(new FormatListArgsInterceptor(['query.id']))
  @UsePipes(new JoiValidationPipe(ProductsValidationService.preList))
  list(@Query() query: TProductListOptions) {
    console.log(query);
    return this.productsService.list(query);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(ProductsValidationService.preCreate))
  create(@Body() payload: TProduct) {
    return this.productsService.create(payload);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe(ProductsValidationService.preUpdate))
  update(@Param('id') id: string, @Body() payload: Partial<TProduct>) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
