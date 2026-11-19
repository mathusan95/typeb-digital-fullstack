export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "CRUD for todos. PATCH /api/todos/{id}/done toggles done.",
  },
  servers: [{ url: "http://localhost:3001", description: "Local" }],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Server and DB status",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Health" },
              },
            },
          },
        },
      },
    },
    "/api/todos": {
      get: {
        tags: ["Todos"],
        summary: "List todos",
        description: "Newest first (createdAt descending).",
        responses: {
          "200": {
            description: "Todo list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Todo" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Todos"],
        summary: "Create todo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TodoWrite" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/todos/{id}": {
      put: {
        tags: ["Todos"],
        summary: "Update todo title and description",
        parameters: [{ $ref: "#/components/parameters/TodoId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TodoWrite" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Todos"],
        summary: "Delete todo",
        parameters: [{ $ref: "#/components/parameters/TodoId" }],
        responses: {
          "204": { description: "Deleted" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/todos/{id}/done": {
      patch: {
        tags: ["Todos"],
        summary: "Toggle done",
        parameters: [{ $ref: "#/components/parameters/TodoId" }],
        responses: {
          "200": {
            description: "Toggled",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
  components: {
    parameters: {
      TodoId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "Mongo ObjectId",
      },
    },
    schemas: {
      Health: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          db: { type: "string", enum: ["connected", "disconnected"] },
        },
      },
      Todo: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          done: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TodoWrite: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", nullable: true },
        },
      },
      Error: {
        type: "object",
        properties: { error: {} },
      },
    },
    responses: {
      BadRequest: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      NotFound: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
    },
  },
};
