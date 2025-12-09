# HelpDeskPro – Sistema de Tickets (Next.js + MongoDB)

HelpDeskPro es una aplicación de gestión de tickets que permite a **clientes** crear solicitudes de soporte y a **agentes** administrarlas, actualizarlas y cerrarlas.  
El proyecto fue desarrollado con **Next.js 14 (App Router)**, **MongoDB**, **Mongoose**, **TypeScript** y **TailwindCSS**.

---

## 🚀 Características principales

### 👤 Autenticación
- Login de usuarios (cliente y agente)
- Registro de nuevos usuarios
- Roles: **client** y **agent**
- Autenticación basada en JWT

### 🎫 Gestión de Tickets

#### Cliente:
- Crear tickets
- Ver solo sus propios tickets
- Ver detalles del ticket
- Agregar comentarios

#### Agente:
- Ver todos los tickets
- Filtrar por estado y prioridad
- Editar ticket:
  - Cambiar prioridad
  - Cambiar estado (open, in-progress, closed)
  - Asignarse el ticket
- Eliminar tickets
- Ver detalles y comentarios

### 📩 Notificaciones por Email
- Email automático para el cliente cuando crea un ticket
- Email automático a todos los agentes cuando se registra un nuevo ticket

### 💾 Base de Datos
- MongoDB Atlas
- Modelos: User, Ticket, Comment
- Semillas (“seed”) para usuarios de prueba

---

## 🛠️ Tecnologías usadas

| Tecnología | Uso |
|-----------|-----|
| **Next.js 14** | Frontend + API |
| **React** | UI |
| **MongoDB Atlas** | Base de datos |
| **Mongoose** | Modelado de datos |
| **JWT** | Autenticación |
| **TailwindCSS** | Estilos |
| **Nodemailer** | Envío de correos |

---

## 📦 Instalación

### 1️⃣ Clona el repositorio
```sh
git clone https://github.com/JuanPablo616/HelpDeskPro
cd helpdeskpro


installacion de dependencias 

npm install 


MONGODB_URI="mongodb+srv://juanrojas0616:pablo0616@juanpablo-16.rmfh2fm.mongodb.net/helpdeskpro?retryWrites=true&w=majority"

JWT_SECRET="clavepruebadesempeño"

EMAIL_USER="juan.rojas0616@gmail.com"
EMAIL_PASS="gkzv fpjr alwz rzwr"


NEXTAUTH_SECRET="clavepruebadesempeño"

TYPESCRIPT_IGNORE_DEPRECATIONS="true"
