# Desafío Técnico: API y Carrito de Compras

Solución fullstack con Next.js (API + Frontend) y TypeScript, cumpliendo todos los requisitos de la prueba técnica: endpoints RESTful, carrito en memoria, frontend React y lógica de combinación óptima de productos.

---

## 📝 Descripción general

Esta aplicación resuelve el desafío propuesto:
- **API RESTful** con endpoints `/api/products` y `/api/cart` (GET y POST), usando rutas API de Next.js y manteniendo el carrito en memoria (sin base de datos ni autenticación).
- **Frontend** en React (Next.js App Router), que consume la API, muestra productos, permite agregarlos al carrito y visualizar su contenido.
- **Función avanzada** `findBestCombination(products, budget)`: encuentra la mejor combinación de productos sin exceder un presupuesto, mostrando el resultado en pantalla.
- **Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Material Tailwind, HeadlessUI, Heroicons.

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js >= 18
- npm >= 9 (o yarn/pnpm)

### Pasos
1. Cloná el repositorio o descargá el código fuente.
2. Instalá las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```
3. Ejecutá el entorno de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```
   El proyecto estará disponible en `http://localhost:3000`.

### Otros comandos útiles
- **Build producción:**
  ```bash
  npm run build
  npm start
  ```
- **Lint:**
  ```bash
  npm run lint
  ```

---

## ⚙️ Funcionalidades implementadas

### Backend (API RESTful)
- **GET `/api/products`**: Devuelve una lista estática de productos (mock, sin DB).
- **POST `/api/cart`**: Recibe un ID de producto y lo agrega al carrito (en memoria).
- **GET `/api/cart`**: Devuelve el carrito actual con los productos agregados.
- El carrito se mantiene en memoria (no persiste entre reinicios, sin stock ni auth).

### Frontend (React/Next.js)
- **Lista de productos**: obtenida desde `/api/products`.
- **Agregar al carrito**: usando `/api/cart` (POST).
- **Visualización del carrito**: usando `/api/cart` (GET).
- **Interfaz básica y responsive**: lista de productos con botón "Agregar al carrito" y vista del carrito.

### Lógica avanzada: combinación óptima
- Implementación de la función:
  ```js
  // Encuentra la mejor combinación de productos sin exceder el presupuesto
  function findBestCombination(products, budget) { /* ... */ }
  ```
- **Entrada:** lista de productos y un presupuesto (ej: 150).
- **Salida:** la combinación de productos de mayor valor total sin superar el presupuesto.
- **Ejemplo:** si el presupuesto es 150 y los productos son `[60, 100, 120, 70]`, devuelve `[60, 70]` (total 130).
- **Sección dedicada en la UI** mostrando la combinación óptima encontrada.

---

## 📁 Estructura principal del proyecto
```
├── src
│   ├── app
│   │   ├── page.tsx         # Página principal y lógica UI
│   │   └── api/             # Endpoints para carrito y productos
│   ├── components/          # ProductList, ShoppingCart, etc.
│   ├── lib/                 # Datos mockeados y lógica combinatoria
│   └── types/               # Tipos TypeScript
├── public/                  # Recursos estáticos
├── tailwind.config.js       # Configuración Tailwind
├── next.config.js           # Configuración Next.js
```

---

## 🛠️ Stack y dependencias principales
- [Next.js](https://nextjs.org/) 15+
- [React](https://react.dev/) 19+
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material Tailwind](https://www.material-tailwind.com/)
- [HeadlessUI](https://headlessui.com/)
- [Heroicons](https://heroicons.com/)

---

## ✅ Buenas prácticas
- Separación clara de lógica y presentación.
- Componentes reutilizables y tipados.
- Uso de rutas API para simular backend.
- Accesibilidad y diseño moderno.
- Listo para escalar o integrar con un backend real.
