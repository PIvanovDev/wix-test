// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { HttpClient } from "src/utils/http-client";

// @Injectable()
// export class WixProductsProvider extends HttpClient {

//     apiToken: string;
//     siteId: string;

//     constructor(consfigService: ConfigService) {
//       const baseUrl = consfigService.get('WIX_PRODUCTS_API_URL');
//       super(baseUrl);
      
//       this.apiToken = consfigService.get('WIX_API_TOKEN');
//       this.siteId = consfigService.get('WIX_SITE_ID');
//     }

//     transformHeaders(headers: Record<string, string>): Record<string, string> {
//       return Object.assign(headers, {
//         'Authorization': this.apiToken,
//         'wix-site-id': this.siteId
//       });
//     }
// }