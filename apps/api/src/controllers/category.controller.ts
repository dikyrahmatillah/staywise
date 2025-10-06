import { NextFunction, Request, Response } from "express";
import {
  createCustomCategoryInputSchema,
  updateCustomCategoryInputSchema,
  getCategoriesQuerySchema,
} from "@repo/schemas";
import { CategoryService } from "../services/category.service.js";

export class CategoryController {
  private categoryService = new CategoryService();

  getCustomCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const tenantId = request.user?.id;
      if (!tenantId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const query = getCategoriesQuerySchema.parse(request.query);
      const result = await this.categoryService.getCustomCategories(
        tenantId,
        query
      );

      response.status(200).json({
        message: "Custom categories fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getDefaultCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const query = getCategoriesQuerySchema.parse(request.query);
      const result = await this.categoryService.getDefaultCategories(query);

      response.status(200).json({
        message: "Default categories fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createCustomCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const tenantId = request.user?.id;
      if (!tenantId)
        return response.status(401).json({ message: "Unauthorized" });

      const data = createCustomCategoryInputSchema.parse(request.body);
      const category = await this.categoryService.createCustomCategory(
        tenantId,
        data
      );

      response.status(201).json({
        message: "Custom category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCustomCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const tenantId = request.user?.id;
      if (!tenantId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const categoryId = request.params.id;
      const data = updateCustomCategoryInputSchema.parse(request.body);

      const category = await this.categoryService.updateCustomCategory(
        tenantId,
        categoryId,
        data
      );

      response.status(200).json({
        message: "Custom category updated successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCustomCategory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const tenantId = request.user?.id;
      if (!tenantId) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const categoryId = request.params.id;

      await this.categoryService.deleteCustomCategory(tenantId, categoryId);

      response.status(200).json({
        message: "Custom category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const categoryController = new CategoryController();
