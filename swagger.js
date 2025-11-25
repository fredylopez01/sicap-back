import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "SICAP Backend",
    description:
      "Sistema Inteligente de Control de Acceso a Parqueaderos - Documentación de API REST",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Ingrese el token en el formato: Bearer {token}",
    },
  },
  tags: [
    {
      name: "Auth",
      description: "Endpoints de autenticación",
    },
    {
      name: "Users",
      description: "Gestión de usuarios/controladores",
    },
    {
      name: "Branches",
      description: "Gestión de sedes/parqueaderos",
    },
    {
      name: "Vehicle Types",
      description: "Gestión de tipos de vehículos",
    },
    {
      name: "Zones",
      description: "Gestión de zonas de parqueo",
    },
    {
      name: "Spaces",
      description: "Gestión de espacios de parqueo",
    },
    {
      name: "Vehicle Records",
      description: "Gestión de registros de entrada/salida de vehículos",
    },
    {
      name: "Schedules",
      description: "Gestión de horarios de sedes",
    },
    {
      name: "Stats",
      description: "Estadísticas y estado del parqueadero",
    },
    {
      name: "Reports",
      description: "Generación de reportes",
    },
  ],
  definitions: {
    LoginRequest: {
      email: "usuario@example.com",
      password: "password123",
    },
    LoginResponse: {
      success: true,
      message: "Login exitoso",
      data: {
        user: {
          id: 1,
          names: "John",
          lastNames: "Doe",
          email: "usuario@example.com",
          role: "ADMIN",
          branchId: 1,
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
    CreateUserRequest: {
      cedula: "1234567890",
      names: "Juan",
      lastNames: "Pérez",
      phone: "3001234567",
      email: "juan.perez@example.com",
      branchId: 1,
      userHash: "jperez",
      password: "password123",
      role: "CONTROLLER",
      hireDate: "2024-01-15",
    },
    CreateBranchRequest: {
      name: "Parqueadero Centro",
      address: "Calle 10 # 20-30",
      city: "Tunja",
      department: "Boyacá",
      phone: "3001234567",
    },
    CreateVehicleTypeRequest: {
      branchId: 1,
      name: "Automóvil",
      description: "Vehículos tipo carro",
      hourlyRate: 3000,
    },
    CreateZoneRequest: {
      branchId: 1,
      name: "Zona A",
      vehicleTypeId: 1,
      totalCapacity: 50,
      description: "Zona principal de parqueo",
    },
    CreateScheduleRequest: {
      branchId: 1,
      dayOfWeek: "monday",
      openingTime: "07:00",
      closingTime: "21:00",
    },
    CreateMultipleSchedulesRequest: {
      branchId: 1,
      schedules: [
        {
          dayOfWeek: "monday",
          openingTime: "07:00",
          closingTime: "21:00",
        },
        {
          dayOfWeek: "tuesday",
          openingTime: "07:00",
          closingTime: "21:00",
        },
      ],
    },
    VehicleEntryRequest: {
      licensePlate: "ABC123",
      spaceId: 1,
      observations: "Cliente frecuente",
    },
    VehicleExitRequest: {
      licensePlate: "ABC123",
      observations: "Salida normal",
    },
    RecordsFilterRequest: {
      branchId: 1,
      licensePlate: "ABC123",
      status: "finished",
      entryStartDate: "2024-01-01",
      entryEndDate: "2024-01-31",
      page: 1,
      pageSize: 10,
    },
    DailySummaryRequest: {
      date: "2024-01-15",
    },
    ReportRequest: {
      type: "general",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    },
    SuccessResponse: {
      success: true,
      message: "Operación exitosa",
      data: {},
    },
    ErrorResponse: {
      success: false,
      message: "Mensaje de error",
    },
  },
};

const outputFile = "./docs/swagger-output.json";
const routes = ["./server.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);