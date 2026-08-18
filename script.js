// ========================================
// CONEXIÓN CON SUPABASE
// ========================================

const SUPABASE_URL = "https://mjcdvrjfswdkzoehpjuv.supabase.co";
const SUPABASE_KEY = "sb_publishable_mboOB3OYb8n6FsF7f37lfQ_qCxLsV5C";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const fechaInicio = new Date("2023-07-29");


// ========================================
// FECHA DE HOY
// ========================================

function actualizarFecha() {

    const ahora = new Date();

    const opciones = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    document.getElementById("fecha").textContent =
        ahora.toLocaleDateString("es-ES", opciones);
}


// ========================================
// CONTADOR DE RELACIÓN
// ========================================

function actualizarContador() {

    const ahora = new Date();

    const diferencia = ahora - fechaInicio;

    const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );

    document.getElementById("contador").textContent =
        `${dias} días ❤️`;
}


// ========================================
// LISTA DE LA COMPRA
// ========================================

// Cargar productos desde Supabase
async function cargarProductos() {

    const { data, error } = await supabaseClient
        .from("productos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error cargando productos:", error);
        return;
    }

    mostrarProductos(data);
}


// Mostrar productos
function mostrarProductos(productos) {

    const lista = document.getElementById("listaCompra");

    lista.innerHTML = "";

    productos.forEach((producto) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>🛒 ${producto.nombre}</span>

            <button
                class="eliminar"
                onclick="eliminarProducto(${producto.id})">
                ❌
            </button>
        `;

        lista.appendChild(li);
    });
}


// Añadir producto
async function agregarProducto() {

    const input =
        document.getElementById("producto");

    const texto = input.value.trim();

    if (texto === "") {
        return;
    }

    const { error } = await supabaseClient
        .from("productos")
        .insert([
            {
                nombre: texto
            }
        ]);

    if (error) {
        console.error("Error añadiendo producto:", error);
        return;
    }

    input.value = "";

    cargarProductos();
}


// Eliminar producto
async function eliminarProducto(id) {

    const { error } = await supabaseClient
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error eliminando producto:", error);
        return;
    }

    cargarProductos();
}

// ========================================
// TAREAS
// ========================================

// Cargar tareas desde Supabase
async function cargarTareas() {

    const { data, error } = await supabaseClient
        .from("tareas")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error cargando tareas:", error);
        return;
    }

    mostrarTareas(data);
}


// Mostrar tareas
function mostrarTareas(tareas) {

    const lista =
        document.getElementById("listaTareas");

    lista.innerHTML = "";

    tareas.forEach((tarea) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>🧹 ${tarea.nombre}</span>

            <button
                class="eliminar"
                onclick="eliminarTarea(${tarea.id})">
                ❌
            </button>
        `;

        lista.appendChild(li);
    });
}


// Añadir tarea
async function agregarTarea() {

    const input =
        document.getElementById("tarea");

    const texto = input.value.trim();

    if (texto === "") {
        return;
    }

    const { error } = await supabaseClient
        .from("tareas")
        .insert([
            {
                nombre: texto
            }
        ]);

    if (error) {
        console.error("Error añadiendo tarea:", error);
        return;
    }

    input.value = "";

    cargarTareas();
}


// Eliminar tarea
async function eliminarTarea(id) {

    const { error } = await supabaseClient
        .from("tareas")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error eliminando tarea:", error);
        return;
    }

    cargarTareas();
}

// ========================================
// GASTOS DE CASA
// ========================================

// Cargar gastos desde Supabase
async function cargarGastos() {

    const { data, error } = await supabaseClient
        .from("gastos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error cargando gastos:", error);
        return;
    }

    mostrarGastos(data);
}


// Mostrar gastos
function mostrarGastos(gastos) {

    const lista = document.getElementById("listaGastos");

    lista.innerHTML = "";

    let total = 0;

    gastos.forEach((gasto) => {

        const importe = Number(gasto.importe);

        total += importe;

        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${gasto.categoria} -
                ${gasto.concepto}
                <strong>${importe.toFixed(2).replace(".", ",")} €</strong>
            </span>

            <button
                class="eliminar"
                onclick="eliminarGasto(${gasto.id})">
                ❌
            </button>
        `;

        lista.appendChild(li);
    });

    document.getElementById("totalMes").textContent =
        `${total.toFixed(2).replace(".", ",")} €`;
}


// Añadir gasto
async function agregarGasto() {

    const concepto =
        document.getElementById("conceptoGasto");

    const importe =
        document.getElementById("importeGasto");

    const categoria =
        document.getElementById("categoriaGasto");

    const textoConcepto =
        concepto.value.trim();

    const valorImporte =
        parseFloat(importe.value);

    if (
        textoConcepto === "" ||
        isNaN(valorImporte) ||
        valorImporte <= 0
    ) {
        return;
    }

    const { error } = await supabaseClient
        .from("gastos")
        .insert([
            {
                concepto: textoConcepto,
                importe: valorImporte,
                categoria: categoria.value
            }
        ]);

    if (error) {
        console.error("Error añadiendo gasto:", error);
        return;
    }

    concepto.value = "";
    importe.value = "";

    cargarGastos();
}


// Eliminar gasto
async function eliminarGasto(id) {

    const { error } = await supabaseClient
        .from("gastos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error eliminando gasto:", error);
        return;
    }

    cargarGastos();
}

// ========================================
// MODO CITA ❤️
// ========================================

function modoCita() {

    const ideas = [

        "🍕 Haced una pizza juntos",

        "🎬 Noche de película",

        "🌙 Salid a dar un paseo",

        "🍝 Cocinad algo nuevo",

        "🎮 Noche de videojuegos",

        "🕯️ Cena romántica en casa",

        "📱 Una hora sin móviles",

        "🍦 Id a tomar un helado",

        "💆 Noche de masajes",

        "❤️ Deciros 3 cosas que os gustan del otro"

    ];

    const aleatoria =
        ideas[Math.floor(Math.random() * ideas.length)];

    document.getElementById("mensaje").textContent =
        aleatoria;
}


// ========================================
// INICIAR APLICACIÓN
// ========================================

actualizarFecha();

actualizarContador();

cargarProductos();

cargarTareas();

cargarGastos();

// ========================================
// ACTUALIZACIONES EN TIEMPO REAL
// ========================================

supabaseClient
    .channel("productos-tiempo-real")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "productos"
        },
        () => {
            cargarProductos();
        }
    )
    .subscribe();


supabaseClient
    .channel("tareas-tiempo-real")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "tareas"
        },
        () => {
            cargarTareas();
        }
    )
    .subscribe();

supabaseClient
    .channel("gastos-tiempo-real")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "gastos"
        },
        () => {
            cargarGastos();
        }
    )
    .subscribe();