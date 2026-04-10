You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.
### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# HCL ECommerce - Copilot Instructions

## Project Overview

HCL ECommerce is a full-stack e-commerce application with an Angular 21 frontend and ASP.NET Core 10 backend with MySQL database.

**Stack:**
- **Frontend**: Angular 21.2.7, RxJS, Standalone APIs, TypeScript 5.9, Vitest, Prettier
- **Backend**: ASP.NET Core 10.0, Entity Framework Core, MySQL, Scalar API documentation
- **Dev Servers**: Frontend on `https://localhost:4200`, Backend on `https://localhost:7196`

---

## Folder Structure

```
HCL_ECommerce/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Singleton services, interceptors
│   │   │   ├── features/    # Feature modules (auth, products, cart, orders, etc.)
│   │   │   ├── shared/      # Reusable components, models, pipes
│   │   │   └── app.config.ts # Standalone app configuration
│   │   └── main.ts
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
│
└── backend/                  # ASP.NET Core application
    ├── Controllers/          # API endpoints
    ├── Models/              # Database models (User, Product, Order, etc.)
    ├── Program.cs           # App configuration, DI setup
    ├── backend.csproj
    └── Properties/launchSettings.json
```

---

## Frontend Development

### Key Conventions

1. **Standalone APIs**: All components are standalone; use `provideRouter()`, `provideBrowserGlobalErrorListeners()` in `app.config.ts`
2. **Core Module Structure**:
   - `core/services/` - Reusable services (API, auth, etc.)
   - `core/interceptors/` - HTTP interceptors (e.g., `api-interceptor.ts` adds base URL)
3. **Feature Organization**: Features live in `features/` (auth, products, cart, checkout, orders, profile)
4. **Routing**: Define routes in `app.routes.ts` using Angular's standalone routing

### Development Commands

```bash
# Start dev server (http://localhost:4200)
npm start
# or
ng serve

# Generate new component
ng generate component feature-name/component-name

# Generate service
ng generate service core/services/service-name

# Generate interceptor
ng generate interceptor core/interceptors/interceptor-name

# Build for production
npm run build

# Run tests
npm test

# Format code
npx prettier --write src/
```

### API Integration

- Base URL is configured in `core/interceptors/api-interceptor.ts` (currently `https://localhost:7196`)
- Interceptor automatically prepends base URL to relative API calls
- Create typed services in `core/services/` for each backend resource

---

## Backend Development

### Key Conventions

1. **Controllers**: RESTful endpoints in `Controllers/` folder
   - Each controller handles a resource (Users, Products, Orders, etc.)
   - Follow standard CRUD patterns

2. **Models**: Database entities in `Models/` folder
   - `EcommerceDbContext.cs` - DbContext for Entity Framework
   - Entities: User, Product, Order, OrderItem, Payment, Address

3. **CORS Configuration**: 
   - Enabled for frontend at `https://localhost:4200`
   - Policy: "AllowAngular" allows any method and header

4. **Database**: MySQL connection string in `appsettings.json`

5. **API Documentation**: Scalar UI available in development at `/scalar/v1`

### Development Commands

```bash
# Run backend (starts on https://localhost:7196)
dotnet run

# Create database migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Build project
dotnet build

# Publish for production
dotnet publish -c Release
```

### Adding New Endpoints

1. Create model in `Models/`
2. Add DbSet to `EcommerceDbContext.cs`
3. Create migration: `dotnet ef migrations add ModelName`
4. Apply migration: `dotnet ef database update`
5. Create controller in `Controllers/` with standard CRUD operations

---

## Common Tasks

### Adding a New Feature (Full Stack)

**Backend**:
1. Add model in `backend/Models/`
2. Update `EcommerceDbContext.cs` with new DbSet
3. Create migration and apply
4. Create controller with endpoints

**Frontend**:
1. Create feature folder in `src/app/features/`
2. Generate components: `ng generate component features/feature-name/components/...`
3. Create service in `core/services/` for API calls
4. Add routes in `app.routes.ts`
5. Import styles with `styleUrl: 'path-to.css'` in components

### Adding HTTP Interceptor

```bash
ng generate interceptor core/interceptors/interceptor-name
```

Import in `app.config.ts`:
```typescript
import { interceptorName } from './core/interceptors/interceptor-name';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([interceptorName]))
  ]
};
```

### Database Migrations

```bash
# Add migration after model changes
dotnet ef migrations add DescriptiveName --project backend

# Apply to database
dotnet ef database update

# Revert last migration
dotnet ef database update PreviousMigrationName
```

---

## Important Notes

- **Frontend runs on**: `https://localhost:4200`
- **Backend runs on**: `https://localhost:7196`
- **API Interceptor**: Automatically prepends base URL to relative requests
- **CORS**: Enabled only for Angular frontend; adjust in `Program.cs` if needed
- **Standalone Components**: No NgModules; use ApplicationConfig providers
- **Code Formatting**: Frontend uses Prettier; ensure formatted before committing

---

## Debugging Tips

- **Frontend**: Use Angular DevTools in browser, check network tab for API calls
- **Backend**: Use Scalar UI at `https://localhost:7196/scalar/v1` to test endpoints
- **Database Issues**: Check `appsettings.json` connection string and migration status
- **CORS Errors**: Verify origin matches `"AllowAngular"` policy in `Program.cs`

---

## Quick Checklist for New Developers

- [ ] Verify MySQL connection in `backend/appsettings.Development.json`
- [ ] Run `dotnet ef database update` to apply migrations
- [ ] Run `npm install` in `frontend/` folder
- [ ] Start backend: `dotnet run` (port 7196)
- [ ] Start frontend: `npm start` (port 4200)
- [ ] Verify API interceptor base URL matches backend URL
