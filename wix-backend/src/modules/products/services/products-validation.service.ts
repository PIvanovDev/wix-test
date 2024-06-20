import * as Joi from "joi";
import { TProduct } from "../types";
import { TFilterProductOptions } from "../providers/products.provider";
import { TPaginationOptions } from "src/utils/types";
import { TProductListOptions } from "./products.service";

const defaults = {
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  param: Joi.object().optional(),
  custom: Joi.object().optional(),
};

export class ProductsValidationService {
  static preCreate = {
    ...defaults,
    body: Joi.object<Omit<TProduct, 'id'>>({
      name: Joi.string().required(),
      priceData: Joi.object({
        price: Joi.number().required(),
      }).required(), 
      productType: Joi.string().required(),
      // inventoryItemId: Joi.number().required(),
      description: Joi.string().required(),
      variants: Joi.array().items(Joi.object({
        price: Joi.number().required(),
        choices: Joi.object({
          Color: Joi.string().required(),
          Size: Joi.string().required(),
        }).required(),
      })),
    }).options({ stripUnknown: true }),
  };

  static preUpdate = {
    ...defaults,
    param: Joi.string().required(),
    body: Joi.object<Omit<TProduct, 'id'>>({
      name: Joi.string(),
      priceData: Joi.object({
        price: Joi.number(),
      }),      
      manageVariants: Joi.boolean(),
      category: Joi.string(),
      inventoryItemId: Joi.string(),
      description: Joi.string(),
      variants: Joi.array().items(Joi.object({
        price: Joi.number().required(),
        choices: Joi.object({
          Color: Joi.string().required(),
          Size: Joi.string().required(),
        }).required(),
      })),
    }).options({ stripUnknown: true }),
  };

  static preList = {
    ...defaults,
    param: Joi.object({
      id: Joi.string().required(),
    }),
    query: Joi.object<TProductListOptions>({
      id: Joi.array().items(Joi.string()),
      name: Joi.string(),
      price: Joi.number(),
      startPrice: Joi.number(),
      endPrice: Joi.number(),
      category: Joi.array().items(Joi.string()),
      inventoryItemId: Joi.string(),
      description: Joi.string(),
      offset: Joi.number(),
      limit: Joi.number()
    }).options({ stripUnknown: true }),
  };
}