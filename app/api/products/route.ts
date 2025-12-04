import { NextRequest, NextResponse } from "next/server";
import { productsService } from "@/lib/database/products";
import { authenticateUser, requireRole } from "@/lib/auth/middleware";
import { apiLogger } from "@/lib/logger";
import { z } from "zod";

// Validation schema for query parameters
const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
  category: z.string().optional(),
  status: z.enum(["draft", "active", "archived", "out_of_stock"]).optional(),
  visibility: z.enum(["visible", "hidden"]).optional(),
  search: z.string().optional(),
  sort_by: z.enum(["created_at", "updated_at", "title", "price"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  low_stock_only: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedQuery = querySchema.parse(queryParams);

    // Get user info (optional for public products)
    const userInfo = await authenticateUser(request);

    // If no user, only show public products
    if (!userInfo) {
      validatedQuery.status = "active";
      validatedQuery.visibility = "visible";
    }

    // Log API request
    apiLogger.request(
      "GET",
      "/api/products",
      userInfo?.user.id,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    );

    // Fetch products
    const result = await productsService.getAll(
      {
        ...validatedQuery,
        sort_by: validatedQuery.sort_by || "created_at",
        sort_order: validatedQuery.sort_order || "desc",
      },
      userInfo?.user.id,
    );

    const duration = Date.now() - startTime;
    apiLogger.response(
      "GET",
      "/api/products",
      200,
      duration,
      userInfo?.user.id,
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      meta: {
        query: validatedQuery,
        duration: `${duration}ms`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    apiLogger.error("GET", "/api/products", error as Error, undefined, 500);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST /api/products - Create new product (requires authentication)
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authenticate user
    const userInfo = await authenticateUser(request);
    if (!userInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      );
    }

    // Check permissions (editor or admin can create products)
    if (!requireRole(userInfo.profile, ["editor", "super_admin"])) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions",
        },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Log API request
    apiLogger.request(
      "POST",
      "/api/products",
      userInfo.user.id,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    );

    // Add created_by to the product data
    const productData = {
      ...body,
      created_by: userInfo.user.id,
    };

    // Create product
    const product = await productsService.create(productData, userInfo.user.id);

    const duration = Date.now() - startTime;
    apiLogger.response(
      "POST",
      "/api/products",
      201,
      duration,
      userInfo.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
        meta: {
          duration: `${duration}ms`,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const userInfo = await authenticateUser(request).catch(() => null);
    apiLogger.error(
      "POST",
      "/api/products",
      error as Error,
      userInfo?.user.id,
      500,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate value",
          message: error.message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT /api/products/bulk - Bulk operations (admin only)
export async function PUT(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authenticate user
    const userInfo = await authenticateUser(request);
    if (!userInfo) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      );
    }

    // Check permissions (admin only for bulk operations)
    if (!requireRole(userInfo.profile, ["super_admin"])) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin access required",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { action, ids, data } = body;

    // Log API request
    apiLogger.request(
      "PUT",
      "/api/products/bulk",
      userInfo.user.id,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    );

    let result;
    let message;

    switch (action) {
      case "updateStatus":
        if (!data?.status || !Array.isArray(ids)) {
          throw new Error("Invalid bulk update data");
        }
        result = await productsService.bulkUpdateStatus(
          ids,
          data.status,
          userInfo.user.id,
        );
        message = `Updated status for ${result} products`;
        break;

      default:
        throw new Error("Unsupported bulk action");
    }

    const duration = Date.now() - startTime;
    apiLogger.response(
      "PUT",
      "/api/products/bulk",
      200,
      duration,
      userInfo.user.id,
    );

    return NextResponse.json({
      success: true,
      data: { affected: result },
      message,
      meta: {
        action,
        duration: `${duration}ms`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const userInfo = await authenticateUser(request).catch(() => null);
    apiLogger.error(
      "PUT",
      "/api/products/bulk",
      error as Error,
      userInfo?.user.id,
      500,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Bulk operation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/products - Not allowed (use specific product endpoint)
export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
      message: "Use /api/products/[id] for individual product deletion",
    },
    { status: 405 },
  );
}
