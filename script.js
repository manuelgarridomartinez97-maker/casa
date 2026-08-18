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
// FUNCIÓN DE SEGURIDAD
// ========================================

function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto || "";

    return div.innerHTML;
}

// ========================================
// AGENDA 📅
// ========================================

async function cargarAgenda() {

    const { data, error } =
        await supabaseClient
            .from("agenda")
            .select("*")
            .order("fecha", {
                ascending: true
            })
            .order("hora", {
                ascending: true
            });

    if (error) {
        console.error(
            "Error cargando agenda:",
            error
        );
        return;
    }

    mostrarAgenda(data || []);
}


function mostrarAgenda(eventos) {

    const lista =
        document.getElementById(
            "listaAgenda"
        );

    if (!lista) return;

    lista.innerHTML = "";

    if (eventos.length === 0) {

        lista.innerHTML = `
            <div class="sin-eventos">
                📅
                <p>
                    No hay eventos próximos.
                </p>
                <small>
                    Añadid vuestro primer plan ❤️
                </small>
            </div>
        `;

        return;
    }

    eventos.forEach((evento) => {

        const elemento =
            document.createElement("div");

        elemento.className =
            "evento-agenda";

        const fecha =
            evento.fecha
                ? new Date(
                    evento.fecha +
                    "T00:00:00"
                ).toLocaleDateString(
                    "es-ES",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                )
                : "";

        let hora = "";

        if (evento.hora) {
            hora =
                evento.hora.substring(0, 5);
        }

        const iconos = {
            Pareja: "❤️",
            Cita: "🍽️",
            Viaje: "✈️",
            Cumpleaños: "🎂",
            Casa: "🏠",
            Otros: "📌"
        };

        const icono =
            iconos[evento.categoria] ||
            "📌";

        elemento.innerHTML = `

            <div class="categoria">
                ${icono}
                ${evento.categoria}
            </div>

            <h3>
                ${escaparHTML(
                    evento.titulo
                )}
            </h3>

            <div class="fecha-evento">
                📅 ${fecha}
                ${hora ? ` · 🕐 ${hora}` : ""}
            </div>

            ${
                evento.notas
                    ? `
                    <div class="notas">
                        ${escaparHTML(
                            evento.notas
                        )}
                    </div>
                    `
                    : ""
            }

            <button
                class="eliminar"
                onclick="eliminarEvento(${evento.id})">
                ❌
            </button>

        `;

        lista.appendChild(elemento);
    });
}


async function agregarEvento() {

    const titulo =
        document.getElementById(
            "tituloAgenda"
        );

    const fecha =
        document.getElementById(
            "fechaAgenda"
        );

    const hora =
        document.getElementById(
            "horaAgenda"
        );

    const categoria =
        document.getElementById(
            "categoriaAgenda"
        );

    const notas =
        document.getElementById(
            "notasAgenda"
        );

    const texto =
        titulo.value.trim();

    if (
        texto === "" ||
        fecha.value === ""
    ) {

        alert(
            "Pon un título y una fecha ❤️"
        );

        return;
    }

    const { error } =
        await supabaseClient
            .from("agenda")
            .insert([
                {
                    titulo: texto,
                    fecha: fecha.value,
                    hora: hora.value || null,
                    categoria:
                        categoria.value,
                    notas:
                        notas.value.trim() ||
                        null
                }
            ]);

    if (error) {

        console.error(
            "Error añadiendo evento:",
            error
        );

        alert(
            "No se ha podido guardar el evento."
        );

        return;
    }

    titulo.value = "";
    fecha.value = "";
    hora.value = "";
    notas.value = "";

    cargarAgenda();
}


async function eliminarEvento(id) {

    const confirmar =
        confirm(
            "¿Eliminar este evento?"
        );

    if (!confirmar) {
        return;
    }

    const { error } =
        await supabaseClient
            .from("agenda")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Error eliminando evento:",
            error
        );

        return;
    }

    cargarAgenda();
}

// ========================================
// INICIAR APLICACIÓN
// ========================================

actualizarFecha();

actualizarContador();

cargarProductos();

cargarTareas();

cargarGastos();

cargarAgenda();

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

supabaseClient
    .channel("agenda-tiempo-real")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "agenda"
        },
        () => {
            cargarAgenda();
        }
    )
    .subscribe();