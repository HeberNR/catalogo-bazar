// 1. CONFIGURACIÓN
const TIENDA_CONFIG = {
    telefono: "5493482605057",
    mensajeBase: "Hola! Me interesa este producto: "
};

// 2. SELECTORES
const grid = document.getElementById('grid-productos');
const modal = document.getElementById('modal-detalle');
const gridReco = document.getElementById('recomendados-grid');
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

// 3. RENDERIZADO DE CARDS
function renderizarProductos(lista) {
    grid.innerHTML = "";
    if (lista.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No se encontraron productos.</p>`;
        return;
    }
    lista.forEach(p => {
        grid.innerHTML += `
            <div class="producto" onclick="abrirModal(${p.id})">
                <div class="img-container skeleton loading">
                    <img src="${p.img}" alt="${p.nombre}">
                </div>
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio.toLocaleString('es-AR')}</p>
                <a class="boton-wa" href="https://wa.me/${TIENDA_CONFIG.telefono}?text=${encodeURIComponent(TIENDA_CONFIG.mensajeBase + p.nombre)}" target="_blank">
                    <i class="fab fa-whatsapp"></i> Consultar
                </a>
            </div>
        `;
    });
    manejarCargaImagenes();
}

// 4. LÓGICA DEL MODAL
window.abrirModal = (id) => {
    const p = PRODUCTOS.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('modal-titulo').innerText = p.nombre;
    document.getElementById('modal-precio').innerText = `$${p.precio.toLocaleString('es-AR')}`;
    document.getElementById('modal-descripcion').innerText = p.desc;
    document.getElementById('modal-img-src').src = p.img;
    document.getElementById('modal-wa-btn').href = `https://wa.me/${TIENDA_CONFIG.telefono}?text=Consulta por: ${p.nombre}`;

    const similares = PRODUCTOS.filter(item => item.categoria === p.categoria && item.id !== p.id).slice(0, 3);
    gridReco.innerHTML = similares.map(s => `
        <div class="item-recomendado" onclick="abrirModal(${s.id})">
            <img src="${s.img}">
            <p>${s.nombre}</p>
        </div>
    `).join('');

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
};

// 5. FILTROS, BUSCADOR Y EVENTOS
function inicializarEventos() {
    const buscador = document.getElementById('buscador');

    // Lógica del Buscador
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase();
            const filtrados = PRODUCTOS.filter(p => 
                p.nombre.toLowerCase().includes(termino) || 
                p.categoria.toLowerCase().includes(termino) ||
                p.desc.toLowerCase().includes(termino)
            );
            renderizarProductos(filtrados);
        });
    }

    // Lógica de Categorías
    document.querySelectorAll('.categorias li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('.categorias li').forEach(c => c.classList.remove('active'));
            li.classList.add('active');
            
            const cat = li.getAttribute('data-categoria');
            const filtrados = (cat === 'all') ? PRODUCTOS : PRODUCTOS.filter(p => p.categoria === cat);
            
            renderizarProductos(filtrados);
            if (navMenu) navMenu.classList.remove('active');
            if (buscador) buscador.value = ""; // Limpia el buscador al cambiar de categoría
        });
    });

    // Toggle Menú Hamburguesa
    if (menuToggle) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
}

// Cerrar modal
document.querySelector('.close-modal').onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

window.onclick = (e) => { if (e.target == modal) { modal.style.display = "none"; document.body.style.overflow = "auto"; } };

// 6. INICIO
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(PRODUCTOS);
    inicializarEventos();
});

function manejarCargaImagenes() {
    document.querySelectorAll('.img-container img').forEach(img => {
        if (img.complete) img.parentElement.classList.remove('skeleton', 'loading');
        else img.onload = () => img.parentElement.classList.remove('skeleton', 'loading');
    });
}