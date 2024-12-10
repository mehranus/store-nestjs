import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEnitiy } from "../entitis/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateProductDto, UpdateProductDto } from "../dto/Product.dto";
import { TypeProduct } from "../enum/product.enum";
import { toBoolean } from "src/common/utils/function.util";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({scope:Scope.REQUEST})
export class ProductService {
  constructor(
    @InjectRepository(ProductEnitiy)
    private readonly productRepository: Repository<ProductEnitiy>,
    @Inject(REQUEST) private readonly req:Request
  ) {}

  async create(productDto: CreateProductDto) {
    if(!this.req.admin) throw new BadRequestException("you not acsess")
    const {
      active_discount,
      code,
      content,
      count,
      discount,
      price,
      slug,
      titel,
      type,
    } = productDto;
    const ObjectProduct: DeepPartial<ProductEnitiy> = {
      titel,
      code,
      slug,
      content,
      discount,
      active_discount: toBoolean(active_discount),
    };
    if (type === TypeProduct.Singel) {
      Object.assign(ObjectProduct, { count, price, type });
    } else if ([TypeProduct.Coloring, TypeProduct.Sizing].includes(type as any))
      ObjectProduct["type"] = type;
    else throw new BadRequestException("Product Type Invalid!");

    await this.productRepository.save(ObjectProduct);
    return {
      message: "create Product susesfully",
    };
  }
  async update(id: number, productDto: UpdateProductDto) {
    const {
      active_discount,
      code,
      content,
      count,
      discount,
      price,
      slug,
      titel,
      type,
    } = productDto;
    const product = await this.findOneLaet(id);

    if (titel) product.titel = titel;
    if (slug) product.slug = slug;
    if (code) product.code = code;
    if (content) product.content = content;
    if (active_discount) product.active_discount = toBoolean(active_discount);
    if (discount) product.discount = discount;

    if (type === TypeProduct.Singel) {
      Object.assign(product, { count, price });
    } else throw new BadRequestException("Product Type Invalid!");

    await this.productRepository.save(product);
    return {
      message: "update Product susesfully",
    };
  }

  async find() {
    return await this.productRepository.find({
      where: {},
      relations: { color: true, size: true, ditels: true },
      select:{ditels:{
        key:true,value:true
      }},
      order:{id:'DESC'}
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { color: true, size: true, ditels: true },
    });
    if (!product) throw new NotFoundException();
    return product;
  }
  async findOneLaet(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException();
    return product;
  }

  async delete(id: number) {
    await this.findOneLaet(id);
    await this.productRepository.delete(id);
    return {
      message: "deleted product sucsesfully",
    };
  }
}
