// ============================================
// DATOS DE LOS PRODUCTOS
// ============================================

const productos = [
    { codigo: "405227.5", descripcion: "PACK SUBLIME 40 DIA + NOCHE PHARMA B. AURORA", precio: "38,50 €" },
    { codigo: "008565", descripcion: "PROMO 365 DIAS SESDERMA", precio: "36,46 €" },
    { codigo: "000032", descripcion: "PROMO PREMIUM NAV 2024", precio: "77,40 €" },
    { codigo: "207530.6", descripcion: "DRYSES DESODORANTE ANTITRANSPIRANTE MUJER 1 ROLL ON 75 ML", precio: "12,45 €" },
    { codigo: "657552.9", descripcion: "PROMOCION DUPLO SESDERMA DRYSES MEN", precio: "12,50 €" },
    { codigo: "217611.9", descripcion: "PENFERULAC CREMA 50ML SESDERMA", precio: "56,27 €" },
    { codigo: "256859.4", descripcion: "ACGLICOLIC CLASSIC FORTE CREMA GEL HIDRATANTE 1 ENVASE 50 ML", precio: "39,98 €" },
    { codigo: "192519.0", descripcion: "SUBLIME CONT OJO ANTIEDAD 15ML", precio: "23,27 €" },
    { codigo: "153901.4", descripcion: "BE+ LECHE LIMPIADORA LIMPIEZA FACIAL 1 ENVASE 200 ML", precio: "16,98 €" },
    { codigo: "213164.4", descripcion: "INDIBA SERUM ILUMINADOR CON EFECTO LIFTING 30ML", precio: "61,65 €" },
    { codigo: "213168.2", descripcion: "INDIBA CREMA EFECTI LIPOFILLING 50ML", precio: "61,65 €" },
    { codigo: "842064.3", descripcion: "CAMALEON STICK SOLAR SPF50", precio: "16,14 €" },
    { codigo: "209041.5", descripcion: "SALISES CREMA ESPUMOSA SIN JABON 1 ENVASE 250 ML", precio: "17,99 €" },
    { codigo: "306274.9", descripcion: "SEBOVALIS CHAMPU 1 ENVASE 200 ML", precio: "18,77 €" }
];

// ============================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ============================================

let productosFiltrados = [...productos];
let ordenActual = { columna: "descripcion", direccion: "asc" };

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

/**
 * Inicializa la página cuando el DOM está completamente cargado
 */
function init() {
    cargarProductos();
    configurarBusqueda();
    configurarOrdenamiento();
    configurarMenuMovil();
    
    // Mostrar mensaje en consola (solo para desarrollo)
    console.log("Farmacia Alcubilla - Página web cargada correctamente");
    console.log(`${productos.length} productos cargados`);
}

/**
 * Carga los productos en la tabla y en las tarjetas para móviles
 */
function cargarProductos() {
    const tableBody = document.getElementById("productsTableBody");
    const cardsContainer = document.getElementById("productsCards");
    
    // Limpiar contenido previo
    tableBody.innerHTML = "";
    cardsContainer.innerHTML = "";
    
    // Si no hay productos después de filtrar, mostrar mensaje
    if (productosFiltrados.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 2rem; color: var(--gray-medium); margin-bottom: 1rem;"></i>
                    <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                </td>
            </tr>
        `;
        
        cardsContainer.innerHTML = `
            <div class="product-card" style="text-align: center;">
                <i class="fas fa-search" style="font-size: 2rem; color: var(--gray-medium); margin-bottom: 1rem;"></i>
                <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
        `;
        return;
    }
    
    // Cargar productos en la tabla (para escritorio)
    productosFiltrados.forEach(producto => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.precio}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Cargar productos en tarjetas (para móviles)
    productosFiltrados.forEach(producto => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-card-header">
                <div class="product-code">Código: ${producto.codigo}</div>
                <div class="product-price">${producto.precio}</div>
            </div>
            <div class="product-description">${producto.descripcion}</div>
        `;
        cardsContainer.appendChild(card);
    });
}

/**
 * Configura la funcionalidad de búsqueda en tiempo real
 */
function configurarBusqueda() {
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearch");
    
    // Buscar productos al escribir en el campo
    searchInput.addEventListener("input", function() {
        const termino = this.value.toLowerCase().trim();
        
        // Mostrar/ocultar botón de limpiar búsqueda
        if (termino.length > 0) {
            clearSearchBtn.style.display = "block";
        } else {
            clearSearchBtn.style.display = "none";
        }
        
        // Filtrar productos
        productosFiltrados = productos.filter(producto => {
            return producto.codigo.toLowerCase().includes(termino) || 
                   producto.descripcion.toLowerCase().includes(termino);
        });
        
        // Aplicar el ordenamiento actual a los productos filtrados
        aplicarOrdenamiento();
        
        // Recargar productos en la vista
        cargarProductos();
    });
    
    // Limpiar búsqueda al hacer clic en el botón X
    clearSearchBtn.addEventListener("click", function() {
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        
        // Restaurar lista completa
        productosFiltrados = [...productos];
        aplicarOrdenamiento();
        cargarProductos();
        
        // Enfocar el campo de búsqueda
        searchInput.focus();
    });
}

/**
 * Configura la funcionalidad de ordenamiento por columnas
 */
function configurarOrdenamiento() {
    const headers = document.querySelectorAll(".products-table th[data-sort]");
    
    headers.forEach(header => {
        header.addEventListener("click", function() {
            const columna = this.getAttribute("data-sort");
            
            // Si ya está ordenando por esta columna, cambiar dirección
            if (ordenActual.columna === columna) {
                ordenActual.direccion = ordenActual.direccion === "asc" ? "desc" : "asc";
            } else {
                // Si es una nueva columna, ordenar ascendente por defecto
                ordenActual.columna = columna;
                ordenActual.direccion = "asc";
            }
            
            // Actualizar indicadores visuales
            actualizarIndicadoresOrdenamiento(columna, ordenActual.direccion);
            
            // Aplicar ordenamiento
            aplicarOrdenamiento();
            
            // Recargar productos en la vista
            cargarProductos();
        });
    });
}

/**
 * Aplica el ordenamiento actual a los productos filtrados
 */
function aplicarOrdenamiento() {
    productosFiltrados.sort((a, b) => {
        let valorA, valorB;
        
        // Obtener valores según la columna a ordenar
        switch (ordenActual.columna) {
            case "code":
                valorA = a.codigo;
                valorB = b.codigo;
                break;
            case "price":
                // Convertir precios a números para ordenar correctamente
                valorA = parseFloat(a.precio.replace("€", "").replace(",", ".").trim());
                valorB = parseFloat(b.precio.replace("€", "").replace(",", ".").trim());
                break;
            case "description":
            default:
                valorA = a.descripcion.toLowerCase();
                valorB = b.descripcion.toLowerCase();
                break;
        }
        
        // Comparar según dirección
        if (valorA < valorB) {
            return ordenActual.direccion === "asc" ? -1 : 1;
        }
        if (valorA > valorB) {
            return ordenActual.direccion === "asc" ? 1 : -1;
        }
        return 0;
    });
}

/**
 * Actualiza los indicadores visuales de ordenamiento en los encabezados de tabla
 */
function actualizarIndicadoresOrdenamiento(columnaActiva, direccion) {
    const headers = document.querySelectorAll(".products-table th[data-sort]");
    
    headers.forEach(header => {
        const indicator = header.querySelector(".sort-indicator");
        const columna = header.getAttribute("data-sort");
        
        // Remover clases activas de todos los headers
        header.classList.remove("active");
        indicator.textContent = "";
        
        // Si es la columna activa, mostrar indicador
        if (columna === columnaActiva) {
            header.classList.add("active");
            indicator.textContent = direccion === "asc" ? "↑" : "↓";
        }
    });
}

/**
 * Configura el menú hamburguesa para dispositivos móviles
 */
function configurarMenuMovil() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    
    if (menuToggle && navList) {
        menuToggle.addEventListener("click", function() {
            navList.classList.toggle("active");
            this.setAttribute("aria-expanded", navList.classList.contains("active"));
            
            // Cambiar icono
            const icon = this.querySelector("i");
            if (navList.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", function() {
                navList.classList.remove("active");
                menuToggle.querySelector("i").classList.remove("fa-times");
                menuToggle.querySelector("i").classList.add("fa-bars");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
        
        // Cerrar menú al hacer clic fuera de él
        document.addEventListener("click", function(event) {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
                navList.classList.remove("active");
                menuToggle.querySelector("i").classList.remove("fa-times");
                menuToggle.querySelector("i").classList.add("fa-bars");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }
}

// ============================================
// INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
// ============================================

document.addEventListener("DOMContentLoaded", init);