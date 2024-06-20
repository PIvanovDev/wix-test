import { FactoryProvider, Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpClient } from 'src/utils/http-client';
import { ProductsProvider } from './providers/products.provider';

// export const ProductsProviderDefinition

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsModule.ProductsProviderDefinition,
    ProductsModule.VariantsProviderDefinition,
  ]
})
export class ProductsModule {
  static ProductsProviderDefinition : FactoryProvider = {
    provide: 'ProductsProvider',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const productApiUrl = configService.get('WIX_API_URL');
  
      const httpClient = new class extends HttpClient {
        constructor() {
          super(productApiUrl);
        }
  
        transformHeaders(headers: Record<string, string>): Record<string, string> {
          return Object.assign(headers, {
            'Authorization': configService.get('WIX_API_TOKEN'),
            'wix-site-id': configService.get('WIX_SITE_ID')
          });
        }
      };
  
      return new ProductsProvider(httpClient);
    },
  }

  static VariantsProviderDefinition : FactoryProvider = {
    provide: 'VariantsProvider',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const productApiUrl = configService.get('WIX_API_URL');
  
      const httpClient = new class extends HttpClient {
        constructor() {
          super(productApiUrl);
        }
  
        transformHeaders(headers: Record<string, string>): Record<string, string> {
          return Object.assign(headers, {
            'Authorization': configService.get('WIX_API_TOKEN'),
            'wix-site-id': configService.get('WIX_SITE_ID')
          });
        }
      };
  
      return new ProductsProvider(httpClient);
    }
  }
}
