# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static educational website about climate change (Cambio Climático) built with vanilla HTML, CSS, and JavaScript. The site uses a Single Page Application (SPA) architecture with AJAX navigation, is in Spanish, and includes informational content, statistics, a contact form with CAPTCHA validation, and an interactive weather forecast page that integrates with a mock API.

## Project Structure

- **Main Entry Point**:
  - `index.html` - Main HTML file that loads the SPA container and navigation

- **HTML Pages** (loaded via AJAX in `pages/` folder):
  - `home.html` - Climate change overview with statistics and images
  - `estadisticas.html` - Statistics page showing climate data tables
  - `formulario.html` - Contact form with CAPTCHA validation
  - `pronostico.html` - Interactive weather forecast with CRUD operations

- **JavaScript**:
  - `main.js` - All application logic including:
    - Navigation menu toggle
    - Dark mode functionality with localStorage persistence
    - CAPTCHA validation system
    - Weather API integration with CRUD operations
    - SPA navigation with AJAX page loading
    - Pagination and filtering for weather data

- **CSS**:
  - `style.css` - Complete styling for the entire application including:
    - Base styles and layout
    - Navigation menu (mobile and desktop)
    - Dark mode theme
    - Table styling
    - Form styling
    - Image styling
    - Weather forecast page specific styles
    - Media queries for responsive design (768px breakpoint)

- **Assets**:
  - `Imgs/` - Contains images including:
    - `captcha/` - Three CAPTCHA images (jucani.jpg, KHXMZ.jpg, ZNAZBG.jpg)
    - Mode toggle icons (modo-oscuro.png, modo-claro.png)
    - Menu icons (barra-de-menus-oscuro.png, barra-de-menus-claro.png)
    - Content images (climate change visuals)

## Key Features & Architecture

### Single Page Application (SPA)
The site uses AJAX navigation to load pages dynamically without full page reloads (`main.js:545-604`):
- `loadPage(page)` - Fetches HTML content via fetch API and injects into `#content` div
- `history.pushState()` - Updates browser URL with hash navigation
- `popstate` event listener - Handles browser back/forward buttons
- `setActiveLink(page)` - Highlights active navigation link
- `initPageFunctionality(page)` - Re-initializes page-specific scripts after content load

### Dark Mode System
The dark mode functionality (`main.js:18-51`) persists user preference using `localStorage`:
- Applies `.oscuro` class to body element
- CSS cascade handles all child element styling via `body.oscuro` selectors
- Swaps icon images between dark/light variants for UI elements
- Automatically restores preference on page load (`main.js:53-57`)
- No need for manual class application to individual elements (CSS handles it)

### Weather Forecast API Integration
The `pronostico.html` page integrates with a MockAPI endpoint for weather data:
- **API URL**: `https://68f6aa0c6b852b1d6f1761d8.mockapi.io/api/v1/Clima`
- **Helper Function**:
  - `crearFilaTabla(item)` - Creates table row elements with data and action buttons, eliminating code duplication (`main.js:~98-144`)
- **CRUD Operations**:
  - `getData()` - Fetches and displays weather data using `crearFilaTabla()` (`main.js:~147-169`)
  - `sendData()` - Adds new forecast entries via POST request (`main.js:~185-217`)
  - `abrirPopupAgregar()` - Opens add forecast modal and clears form (`main.js:~171-179`)
  - `cerrarPopupAgregar()` - Closes add forecast modal (`main.js:~181-183`)
  - `modifyData()` - Updates existing entries via PUT request (`main.js:~237-267`)
  - `abrirPopupModificar(id)` - Opens modify modal and loads current data (`main.js:~219-235`)
  - `cerrarPopup()` - Closes modify modal (`main.js:~237-239`)
  - `deleteData()` - Removes entries via DELETE request (`main.js:~271-293`)
- **Pagination**: Uses URL search parameters `page` (initial: 1) and `limit` (7 items per page) (`main.js:~295-320`)
  - `paginacionSiguiente()` - Advances to next page
  - `paginacionAnterior()` - Goes to previous page (with page 1 minimum validation)
- **Filtering**: 
  - `filtrar()` - Real-time search across all fields (day, condition, temperatures, rain probability) using `crearFilaTabla()` (`main.js:~325-355`)
  - `limpiarFiltro()` - Clears filter input and reloads full data (`main.js:~357-360`)
- **Event Delegation**: Uses event delegation on tbody for modify/delete button clicks (`main.js:~367-378`)
- **Modal System**: Two popup overlays for add/modify operations with form validation

### Navigation System
The site features a responsive navigation menu (`main.js:3-12`):
- **Mobile**: Hamburger menu that slides in from right side with overlay
- **Desktop**: Horizontal navigation bar (transforms at 768px via media query)
- Toggle functionality with `.desplegar` class
- CSS handles animations and transformations (`style.css:171-204`)

### CAPTCHA Validation
The contact form (`formulario.html`) includes custom CAPTCHA (`main.js:59-95`):
- `initCaptcha()` - Initializes CAPTCHA system (only runs if form exists on page)
- `recargarCaptcha()` - Randomly selects from three images in `Imgs/captcha/`
- Stores correct code (filename without extension) in image's `dataset.codigo` attribute
- `validarCaptcha()` - Validates user input and displays success/error message
- Reload button allows users to get a new challenge

### Initialization System
Page-specific functionality is initialized after AJAX loads (`main.js:~585-593`):
- `initPageFunctionality(page)` - Routes to appropriate init function based on loaded page
  - Calls `initPronostico()` when pronostico.html is loaded
  - Calls `initCaptcha()` when formulario.html is loaded
- `initPronostico()` - Sets up all weather forecast event listeners and loads initial data (`main.js:~365-460`)

## Development Notes

### No Build System
This is a vanilla HTML/CSS/JS project with no build tools, package managers, or dependencies. All code runs directly in the browser.

### Code Organization
All JavaScript is consolidated in a single `main.js` file wrapped in a DOMContentLoaded event listener for proper initialization. Functions are scoped appropriately and organized by feature area.

### State Management
The application uses module-scoped variables for tracking state:
- `datosClima` - Stores fetched weather data for filtering operations
- `idEliminar` - Tracks ID of item to delete
- `idModificar` - Tracks ID of item being modified
- `urlObj` - URL object for API endpoint with search parameters

### Testing
To test the site locally, you need a web server (due to CORS and fetch API requirements):
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000`

### API Data Structure
Weather forecast objects have this schema:
```json
{
  "id": "string",
  "dia": "Lunes 27/10",
  "condicion": "Lluvia",
  "temperatura_maxima": 24,
  "temperatura_minima": 17,
  "Probabilidad_de_lluvia": 70
}
```

### CSS Architecture
The entire application is styled through a single `style.css` file organized by sections:
- Base styles and resets
- Header and navigation
- Content layout (paragraphs, headings, lists)
- Table styling
- Form styling
- Button styling
- Image styling
- Dark mode overrides (`body.oscuro` selectors)
- Modal/popup styling
- Media queries for responsive design (768px+ breakpoint)

### Recent Improvements
- Eliminated ~100 lines of duplicated code by extracting `crearFilaTabla()` helper function
- Removed nested DOMContentLoaded event listener
- Simplified `initPageFunctionality()` to rely on CSS cascade instead of manual class manipulation
- Changed `innerHTML` to `textContent` for better security and performance where appropriate

### Browser Compatibility
- Uses modern JavaScript (ES6+): arrow functions, const/let, async/await, fetch API
- Requires localStorage support for dark mode persistence
- History API for SPA navigation
- No polyfills included - targets modern browsers