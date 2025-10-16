# Manual de Usuario - SICAP

## Sistema Inteligente de Control de Acceso a Parqueaderos

**Versión 1.0 - Sprint 1**

---

## 📋 Contenido

1. [Introducción](#introducción)
2. [Inicio de Sesión](#inicio-de-sesión)
3. [Gestión de Sedes](#gestión-de-sedes)
4. [Gestión de Usuarios](#gestión-de-usuarios)
5. [Roles y Permisos](#roles-y-permisos)
6. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

SICAP es una plataforma web para gestionar parqueaderos de forma inteligente y eficiente. Este manual cubre las funcionalidades disponibles en la versión Sprint 1.

### ¿Qué puedo hacer con SICAP?

- ✅ Iniciar sesión de forma segura
- ✅ Registrar sedes de parqueaderos
- ✅ Crear usuarios controladores
- ✅ Visualizar información de las sedes

### Requisitos

- Navegador web moderno (Chrome, Firefox, Edge o Safari)
- Conexión a Internet estable
- Credenciales de acceso proporcionadas por el administrador

---

## Inicio de Sesión

### Acceder al sistema

1. Abra el navegador y vaya a la dirección de SICAP
2. En la página de inicio, haga clic en **"Acceder"**
3. Complete sus credenciales:
   - **Usuario o Email**
   - **Contraseña**
4. Haga clic en **"Iniciar Sesión"**

### Seguridad

- Después de **5 intentos fallidos**, su cuenta se bloqueará por **15 minutos**
- Las sesiones duran **1 hora** por seguridad
- Si olvidó su contraseña, use el enlace **"¿Olvidó su contraseña?"**

---

## Gestión de Sedes

### Ver sedes registradas

1. En el menú lateral, seleccione **"Sedes"**
2. Verá dos paneles:
   - **Panel izquierdo**: Visualización de mapa (próximamente)
   - **Panel derecho**: Lista de sedes
3. Haga clic en cualquier sede para ver sus detalles

### Crear una nueva sede

#### Paso 1: Acceder al formulario

- Desde la vista de Sedes, haga clic en **"Crear sede"**

#### Paso 2: Completar información

| Campo                  | Descripción           | Ejemplo          |
| ---------------------- | --------------------- | ---------------- |
| **Nombre\***           | Nombre de la sede     | Sede Principal   |
| **Dirección\***        | Ubicación completa    | Calle 123 #45-67 |
| **Ciudad\***           | Ciudad donde opera    | Bogotá           |
| **Departamento\***     | Departamento o estado | Cundinamarca     |
| **Teléfono\***         | 10 dígitos numéricos  | 3101234567       |
| **Horario apertura\*** | Hora de inicio        | 08:00            |
| **Horario cierre\***   | Hora de cierre        | 18:00            |

_Los campos con _ son obligatorios\*

#### Paso 3: Guardar

- Haga clic en **"Crear sede"**
- Si todo es correcto, verá el mensaje de confirmación
- Será redirigido a la lista de sedes

### Validaciones importantes

- El teléfono debe tener exactamente **10 dígitos**
- La hora de cierre debe ser **posterior** a la hora de apertura
- Todos los campos son obligatorios

---

## Gestión de Usuarios

### Crear usuario controlador

Solo los **Administradores** pueden crear usuarios.

#### Paso 1: Acceder al formulario

- En el menú lateral, seleccione **"Crear usuario"**

#### Paso 2: Completar el formulario

El formulario está dividido en 4 secciones:

**1. Información Personal**

- **Número de Cédula\***: Solo números, mínimo 8 dígitos
- **Nombres\***: Nombres completos
- **Apellidos\***: Apellidos completos

**2. Contacto**

- **Teléfono\***: 10 dígitos numéricos
- **Correo Electrónico\***: Formato válido (usuario@dominio.com)

**3. Información Laboral**

- **ID de Sede\***: Número de la sede asignada
- **Rol\***: Administrador o Controlador
- **Fecha de Contratación\***: Fecha de hoy o futura

**4. Credenciales**

- **Nombre de Usuario\***: Mínimo 6 caracteres, único
- **Contraseña\***: Mínimo 8 caracteres (ver requisitos abajo)

#### Requisitos de contraseña segura:

- ✓ Mínimo 8 caracteres
- ✓ Al menos una mayúscula (A-Z)
- ✓ Al menos una minúscula (a-z)
- ✓ Al menos un número (0-9)
- ✓ Al menos un carácter especial (!@#$%^&\*)

**Ejemplo válido**: `Segur@123`

#### Paso 3: Guardar

- Revise que todos los campos estén correctos
- Haga clic en **"Crear usuario"**
- Si es exitoso, será redirigido a la lista de usuarios

---

## Roles y Permisos

SICAP tiene dos tipos de usuarios con diferentes permisos:

### 🔑 Administrador (ADMIN)

**Puede hacer:**

- ✅ Crear, ver y gestionar sedes
- ✅ Crear y gestionar usuarios
- ✅ Acceder a todas las funcionalidades
- ✅ Ver reportes del sistema (próximamente)

### 👤 Controlador (CONTROLLER)

**Puede hacer:**

- ✅ Ver información de su sede asignada
- ✅ Acceder a funcionalidades operativas (próximamente)

**No puede hacer:**

- ❌ Crear o modificar sedes
- ❌ Crear otros usuarios
- ❌ Acceder a configuración del sistema

---

## Solución de Problemas

### No puedo iniciar sesión

**Problema**: "Usuario o contraseña incorrectos"

**Solución**:

1. Verifique que el usuario y contraseña estén bien escritos
2. Revise que no haya espacios adicionales
3. Use "¿Olvidó su contraseña?" si es necesario
4. Si persiste, contacte al administrador

---

**Problema**: "Tu cuenta está bloqueada temporalmente"

**Solución**:

- Espere el tiempo indicado (15 minutos)
- Si olvidó su contraseña, use la opción de recuperación

---

**Problema**: "Tu cuenta está inactiva"

**Solución**:

- Contacte al administrador del sistema para activar su cuenta

---

### Errores al crear sedes

**"El teléfono debe tener 10 dígitos"**

- Ingrese exactamente 10 números sin espacios ni guiones
- Ejemplo correcto: `3101234567`

**"La hora de cierre debe ser mayor que la hora de apertura"**

- Verifique que el horario de cierre sea posterior
- Ejemplo: Apertura `08:00`, Cierre `18:00` ✓

---

### Errores al crear usuarios

**"Este correo electrónico ya está registrado"**

- Use un email diferente
- Verifique si el usuario ya existe en el sistema

**"Este número de cédula ya está registrada"**

- Confirme que no se haya creado el usuario previamente

**"Esta sede no existe"**

- Verifique que el ID de sede sea correcto
- Consulte la lista de sedes disponibles

**"Este nombre de usuario ya está en uso"**

- Elija un nombre de usuario diferente
- Ejemplo: si `jperez` está ocupado, intente `jperez2`

**Contraseña rechazada**

- Asegúrese de cumplir todos los requisitos de seguridad
- Debe incluir: mayúscula, minúscula, número y carácter especial

---

### Problemas de conexión

**"Error de conexión con el servidor"**

**Solución**:

1. Verifique su conexión a Internet
2. Recargue la página (F5)
3. Intente con otro navegador
4. Contacte soporte técnico si persiste

---

## Preguntas Frecuentes

**¿Cuánto tiempo permanezco conectado?**  
Tu sesión dura 1 hora. Después deberás iniciar sesión nuevamente.

**¿Puedo modificar una sede después de crearla?**  
En esta versión solo está disponible la creación. La edición estará en próximas versiones.

**¿Cuántas sedes puedo registrar?**  
No hay límite de sedes.

**¿Puedo acceder desde mi celular?**  
Sí, SICAP es responsive y funciona en dispositivos móviles.

**¿Qué navegadores son compatibles?**  
Chrome, Firefox, Edge y Safari en sus versiones recientes.

**¿Cómo recupero mi contraseña?**  
Usa el enlace "¿Olvidó su contraseña?" en la página de login.

**¿Puedo compartir mi cuenta?**  
No, cada usuario debe tener su propia cuenta por seguridad.

---

## Endpoints de la API

Para integraciones o desarrollo:

### Autenticación

```
POST /api/auth/login
Body: { "email": "usuario@ejemplo.com", "password": "contraseña" }
```

### Sedes

```
POST /api/branches/
Headers: Authorization: Bearer {token}
Body: { "name", "address", "city", "department", "phone", "openingTime", "closingTime" }
```

### Usuarios

```
POST /api/users
Headers: Authorization: Bearer {token}
Body: { "cedula", "names", "lastNames", "phone", "email", "branchId", "userHash", "password", "role", "hireDate" }
```

---

## Próximas Funcionalidades

En futuras versiones incluiremos:

- ✨ Editar y eliminar sedes
- ✨ Editar y eliminar usuarios
- ✨ Control de entrada/salida de vehículos
- ✨ Mapa interactivo de sedes
- ✨ Dashboard con estadísticas
- ✨ Sistema de reportes
- ✨ Notificaciones en tiempo real

---

## Contacto y Soporte

**Email**:
juan.moreno22@uptc.edu.co
david.naranjo03@uptc.edu.co
fredy.lopez04@uptc.edu.co
**GitHub**: https://github.com/fredylopez01/sicap-back  
**Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

---

**© 2025 SICAP**  
_Versión 1.0 - Septiembre 2025_
