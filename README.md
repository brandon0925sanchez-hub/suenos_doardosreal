# Sueños Dorados - Landing Page de Cerámicas

## Configuración del Proyecto

1. Instalar dependencias:
```bash
npm install
```

2. Configurar Firebase:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto
   - Habilita:
     - Authentication (con Email/Password)
     - Firestore Database (en modo de prueba para empezar)
     - Storage (en modo de prueba para empezar)
   - Copia tu configuración de Firebase y reemplaza los valores en `src/firebase.js`
   - Crea un usuario admin en Firebase Authentication manualmente

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

4. Para acceder al panel de administración, visita `/admin`

## Características

- Landing page responsiva
- Catálogo de cerámicas con filtro por material (yeso/resina)
- Catálogo de cuadros en resina
- Botón de WhatsApp flotante
- Panel de administración privado para gestionar productos
