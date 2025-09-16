# 🚗 BACKEND SICAP (Sistema Inteligente de Acceso a Parqueaderos)

Backend del sistema de gestión inteligente de parqueaderos.  
Este módulo está desarrollado en **Node.js** con **Express.js** y expone una **API REST** para ser consumida por el frontend y otros servicios.

---

## ✨ Beneficios

- ⚡ **Operaciones rápidas y confiables**: manejo eficiente de entradas, salidas y disponibilidad.
- 🔒 **Seguridad integrada**: autenticación con JWT/OAuth2.
- 📊 **Datos centralizados**: reportes y dashboards siempre actualizados.
- 📈 **Escalabilidad**: listo para crecer con nuevas sedes y funcionalidades.

---

## 🛠️ Tecnologías

- **Node.js** (v18+)
- **Express.js** (framework de APIs)
- **TypeScript** (tipado estático y mantenibilidad)
- **JWT** (autenticación y seguridad)
- **PostgreSQL** (según la BD seleccionada)
- **Prisma** (ORM/ODM para la BD)

---

## 📂 Estructura del proyecto

```bash
backend/
├── src/
│   ├── config/        # Configuración (BD, JWT, variables entorno)
│   ├── controllers/   # Lógica de controladores para cada recurso
│   ├── middlewares/   # Autenticación, validaciones, logs
│   ├── models/        # Definiciones de entidades (ORM/ODM)
│   ├── routes/        # Definición de endpoints REST
│   ├── services/      # Reglas de negocio y lógica reusable
│   ├── utils/         # Utilidades/helpers
│   └── index.ts       # Punto de entrada de la API
├── tests/             # Pruebas automáticas
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 🚀 Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/fredylopez01/sicap-back.git
cd sicap-back
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz, con las variables que se muestran en `.env.example`

4. Inicia el servidor en desarrollo:

```bash
npm run dev
```

Servidor disponible en 👉 [http://localhost:3000](http://localhost:3000)

---

## 📌 Endpoints principales (Planeados/Desarrollo)

- `POST /api/auth/login` → Autenticación de usuarios
- `GET /api/sedes` → Listar sedes
- `POST /api/sedes` → Crear sede
- `GET /api/usuarios` → Listar usuarios
- `POST /api/ingresos` → Registrar entrada de vehículo
- `POST /api/egresos` → Registrar salida de vehículo
- `GET /api/ocupacion` → Espacios disponibles en tiempo real
- `GET /api/reportes` → Generar reportes con filtros

---

## 📅 Roadmap Backend

- 🧱 Configuración inicial con Node + Express
- 🛢️ Modelo de base de datos con entidades: sedes, usuarios, horarios, tarifas, ingresos, egresos, espacios
- 🛡️ Middleware de autenticación (JWT/OAuth2)
- 📊 Endpoints para reportes y estadísticas
- ✅ Pruebas automáticas de API con Jest y Supertest

---

## 🤝 Contribución

1. Haz un **fork** del proyecto.
2. Crea una nueva rama: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz commit: `git commit -m "Agrego nueva funcionalidad"`.
4. Sube tu rama: `git push origin feature/nueva-funcionalidad`.
5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
Consulta el archivo [LICENSE](./LICENSE) para más información.
