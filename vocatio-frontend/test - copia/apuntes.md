# Apuntes de Frontend Vocatio

## Angular Introduccion

#### Componentes
- Son las piezas basicas de una aplicacion Angular.
- Cada componente tiene una plantilla HTML, una clase TypeScript y estilos CSS.
- Se definen utilizando el decorador `@Component`.

### Directivas

- Son instrucciones en el DOM que le dicen a Angular cómo manipular elementos y atributos.
- Hay directivas estructurales (como `*ngIf`, `*ngFor`)
    y directivas de atributos (como `ngClass`, `ngStyle`).

### Servicios
- Son clases que proporcionan funcionalidades específicas y pueden ser compartidas entre diferentes componentes.
- Se definen utilizando el decorador `@Injectable`.
- Se utilizan para manejar la lógica de negocio, acceder a APIs, etc.
  
### Pipes
- Son funciones que transforman datos en plantillas.
- Se utilizan para formatear fechas, monedas, textos, etc.
- Se definen utilizando el decorador `@Pipe`.

### Componentes de rutas
- Permiten la navegación entre diferentes vistas en una aplicación Angular.
- Se configuran utilizando el módulo `RouterModule`.
- Cada ruta se asocia con un componente específico que se renderiza cuando se navega a esa ruta.

