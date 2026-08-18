// ========================================
// CONEXIÓN CON SUPABASE
// ========================================

const SUPABASE_URL =
    "https://mjcdvrjfswdkzoehpjuv.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_mboOB3OYb8n6FsF7f37lfQ_qCxLsV5C";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

const fechaInicio =
    new Date("2023-07-29");


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

    const elemento =
        document.getElementById("fecha");

    if (elemento) {

        elemento.textContent =
            ahora.toLocaleDateString(
                "es-ES",
                opciones
            );
    }
}


// ========================================
// CONTADOR
// ========================================

function actualizarContador() {

    const ahora = new Date();

    const diferencia =
        ahora - fechaInicio;

    const dias =
        Math.floor(
            diferencia /
            (1000 * 60 * 60 * 24)
        );

    const elemento =
        document.getElementById("contador");

    if (elemento) {

        elemento.textContent =
            `${dias} días ❤️`;
    }
}


// ========================================
// SEGURIDAD HTML
// ========================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto || "";

    return div.innerHTML;
}


// ========================================
// LISTA DE LA COMPRA
// ========================================

async function cargarProductos() {

    const { data, error } =
        await supabaseClient
            .from("productos")
            .select("*")
            .order("id", {
                ascending: true
            });

    if (error) {

        console.error(
            "Error cargando productos:",
            error
        );

        return;
    }

    mostrarProductos(data || []);

    actualizarPanel();
}


function mostrarProductos(productos) {

    const lista =
        document.getElementById(
            "listaCompra"
        );

    if (!lista) return;

    lista.innerHTML = "";

    productos.forEach(
        (producto) => {

            const li =
                document.createElement("li");

            li.innerHTML = `

                <span>
                    🛒 ${escaparHTML(
                        producto.nombre
                    )}
                </span>

                <button
                    class="eliminar"
                    onclick="eliminarProducto(${producto.id})">

                    ❌

                </button>

            `;

            lista.appendChild(li);
        }
    );
}


async function agregarProducto() {

    const input =
        document.getElementById(
            "producto"
        );

    if (!input) return;

    const texto =
        input.value.trim();

    if (texto === "") return;

    const { error } =
        await supabaseClient
            .from("productos")
            .insert([
                {
                    nombre: texto
                }
            ]);

    if (error) {

        console.error(
            "Error añadiendo producto:",
            error
        );

        alert(
            "No se ha podido añadir el producto."
        );

        return;
    }

    input.value = "";

    cargarProductos();
}


async function eliminarProducto(id) {

    const { error } =
        await supabaseClient
            .from("productos")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Error eliminando producto:",
            error
        );

        return;
    }

    cargarProductos();
}


// ========================================
// TAREAS
// ========================================

async function cargarTareas() {

    const { data, error } =
        await supabaseClient
            .from("tareas")
            .select("*")
            .order("id", {
                ascending: true
            });

    if (error) {

        console.error(
            "Error cargando tareas:",
            error
        );

        return;
    }

    mostrarTareas(data || []);

    actualizarPanel();
}


function mostrarTareas(tareas) {

    const lista =
        document.getElementById(
            "listaTareas"
        );

    if (!lista) return;

    lista.innerHTML = "";

    tareas.forEach(
        (tarea) => {

            const li =
                document.createElement("li");

            li.innerHTML = `

                <span>
                    🧹 ${escaparHTML(
                        tarea.nombre
                    )}
                </span>

                <button
                    class="eliminar"
                    onclick="eliminarTarea(${tarea.id})">

                    ❌

                </button>

            `;

            lista.appendChild(li);
        }
    );
}


async function agregarTarea() {

    const input =
        document.getElementById(
            "tarea"
        );

    if (!input) return;

    const texto =
        input.value.trim();

    if (texto === "") return;

    const { error } =
        await supabaseClient
            .from("tareas")
            .insert([
                {
                    nombre: texto
                }
            ]);

    if (error) {

        console.error(
            "Error añadiendo tarea:",
            error
        );

        alert(
            "No se ha podido añadir la tarea."
        );

        return;
    }

    input.value = "";

    cargarTareas();
}


async function eliminarTarea(id) {

    const { error } =
        await supabaseClient
            .from("tareas")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Error eliminando tarea:",
            error
        );

        return;
    }

    cargarTareas();
}


// ========================================
// GASTOS
// ========================================

async function cargarGastos() {

    const { data, error } =
        await supabaseClient
            .from("gastos")
            .select("*")
            .order("created_at", {
                ascending: false
            });

    if (error) {

        console.error(
            "Error cargando gastos:",
            error
        );

        return;
    }

    mostrarGastos(data || []);

    actualizarPanel();
}


function mostrarGastos(gastos) {

    const lista =
        document.getElementById(
            "listaGastos"
        );

    if (!lista) return;

    lista.innerHTML = "";

    let total = 0;

    gastos.forEach(
        (gasto) => {

            const importe =
                Number(
                    gasto.importe
                ) || 0;

            total += importe;

            const li =
                document.createElement("li");

            li.innerHTML = `

                <span>

                    ${escaparHTML(
                        gasto.categoria
                    )}
                    -

                    ${escaparHTML(
                        gasto.concepto
                    )}

                    <strong>
                        ${importe
                            .toFixed(2)
                            .replace(".", ",")
                        } €
                    </strong>

                </span>

                <button
                    class="eliminar"
                    onclick="eliminarGasto(${gasto.id})">

                    ❌

                </button>

            `;

            lista.appendChild(li);
        }
    );

    const totalElemento =
        document.getElementById(
            "totalMes"
        );

    if (totalElemento) {

        totalElemento.textContent =
            `${total
                .toFixed(2)
                .replace(".", ",")
            } €`;
    }
}


async function agregarGasto() {

    const concepto =
        document.getElementById(
            "conceptoGasto"
        );

    const importe =
        document.getElementById(
            "importeGasto"
        );

    const categoria =
        document.getElementById(
            "categoriaGasto"
        );

    if (
        !concepto ||
        !importe ||
        !categoria
    ) return;

    const textoConcepto =
        concepto.value.trim();

    const valorImporte =
        parseFloat(
            importe.value
        );

    if (
        textoConcepto === "" ||
        isNaN(valorImporte) ||
        valorImporte <= 0
    ) {

        alert(
            "Introduce un concepto y un importe válido."
        );

        return;
    }

    const { error } =
        await supabaseClient
            .from("gastos")
            .insert([
                {
                    concepto:
                        textoConcepto,

                    importe:
                        valorImporte,

                    categoria:
                        categoria.value
                }
            ]);

    if (error) {

        console.error(
            "Error añadiendo gasto:",
            error
        );

        alert(
            "No se ha podido añadir el gasto."
        );

        return;
    }

    concepto.value = "";
    importe.value = "";

    cargarGastos();
}


async function eliminarGasto(id) {

    const { error } =
        await supabaseClient
            .from("gastos")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(
            "Error eliminando gasto:",
            error
        );

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
        ideas[
            Math.floor(
                Math.random() *
                ideas.length
            )
        ];

    const mensaje =
        document.getElementById(
            "mensaje"
        );

    if (mensaje) {

        mensaje.textContent =
            aleatoria;
    }
}


// ========================================
// AGENDA
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

    actualizarPanel();
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

    eventos.forEach(
        (evento) => {

            const elemento =
                document.createElement(
                    "div"
                );

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

            const hora =
                evento.hora
                    ? evento.hora.substring(
                        0,
                        5
                    )
                    : "";

            const iconos = {

                Pareja: "❤️",
                Cita: "🍽️",
                Viaje: "✈️",
                Cumpleaños: "🎂",
                Casa: "🏠",
                Otros: "📌"

            };

            const icono =
                iconos[
                    evento.categoria
                ] || "📌";

            elemento.innerHTML = `

                <div class="categoria">

                    ${icono}

                    ${escaparHTML(
                        evento.categoria
                    )}

                </div>

                <h3>

                    ${escaparHTML(
                        evento.titulo
                    )}

                </h3>

                <div class="fecha-evento">

                    📅 ${fecha}

                    ${
                        hora
                            ? ` · 🕐 ${hora}`
                            : ""
                    }

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

            lista.appendChild(
                elemento
            );
        }
    );
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

    if (
        !titulo ||
        !fecha ||
        !hora ||
        !categoria ||
        !notas
    ) return;

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
                    titulo:
                        texto,

                    fecha:
                        fecha.value,

                    hora:
                        hora.value ||
                        null,

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

    if (!confirmar) return;

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
// FOTOS 📸
// ========================================

const BUCKET_FOTOS =
    "fotos";


// ----------------------------------------
// MOSTRAR FOTO SELECCIONADA
// ----------------------------------------

function mostrarFotoSeleccionada() {

    const input =
        document.getElementById("foto");

    const nombre =
        document.getElementById(
            "nombreFoto"
        );

    if (
        !input ||
        !nombre
    ) {
        return;
    }

    if (
        input.files &&
        input.files.length > 0
    ) {

        const archivo =
            input.files[0];

        nombre.textContent =
            `📸 ${archivo.name}`;

        console.log(
            "Foto seleccionada:",
            archivo.name,
            archivo.size,
            archivo.type
        );

    } else {

        nombre.textContent =
            "Ninguna foto seleccionada";
    }
}


// ----------------------------------------
// CARGAR FOTOS
// ----------------------------------------

async function cargarFotos() {

    const { data, error } =
        await supabaseClient
            .from("fotos")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "Error cargando fotos:",
            error
        );

        mostrarErrorFotos();

        return;
    }

    mostrarFotos(
        data || []
    );
}


// ----------------------------------------
// MOSTRAR GALERÍA
// ----------------------------------------

function mostrarFotos(fotos) {

    const galeria =
        document.getElementById(
            "galeriaFotos"
        );

    if (!galeria) return;

    galeria.innerHTML = "";

    if (
        fotos.length === 0
    ) {

        galeria.innerHTML = `

            <div class="sin-fotos">

                <div class="icono">
                    📸
                </div>

                <p>
                    Todavía no hay recuerdos.
                </p>

                <small>
                    Subid vuestra primera foto ❤️
                </small>

            </div>

        `;

        return;
    }

    fotos.forEach(
        (foto) => {

            const elemento =
                document.createElement(
                    "div"
                );

            elemento.className =
                "foto-card";

            let fechaTexto = "";

            const fecha =
                foto.fecha ||
                foto.created_at;

            if (fecha) {

                fechaTexto =
                    new Date(
                        fecha
                    ).toLocaleDateString(
                        "es-ES",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );
            }

            const urlSegura =
                escaparHTML(
                    foto.url
                );

            const titulo =
                escaparHTML(
                    foto.descripcion ||
                    foto.nombre ||
                    "Recuerdo"
                );

            elemento.innerHTML = `

                <img
                    src="${urlSegura}"
                    alt="${titulo}"
                    loading="lazy"
                    onclick="abrirFoto(${JSON.stringify(
                        foto.url
                    )})"
                >

                <button
                    class="foto-eliminar"
                    onclick="eliminarFoto(${foto.id})"
                    title="Eliminar foto">

                    🗑️

                </button>

                <div class="foto-info">

                    <strong>
                        ${titulo}
                    </strong>

                    ${
                        fechaTexto
                            ? `

                                <div class="foto-fecha">

                                    📅 ${fechaTexto}

                                </div>

                            `
                            : ""
                    }

                </div>

            `;

            galeria.appendChild(
                elemento
            );
        }
    );
}


// ----------------------------------------
// SUBIR FOTO
// ----------------------------------------

async function subirFoto() {

    const input =
        document.getElementById(
            "foto"
        );

    const descripcion =
        document.getElementById(
            "descripcionFoto"
        );

    const boton =
        document.getElementById(
            "botonSubirFoto"
        );

    const nombreFoto =
        document.getElementById(
            "nombreFoto"
        );

    if (
        !input ||
        !input.files ||
        input.files.length === 0
    ) {

        alert(
            "Selecciona una foto primero 📸"
        );

        return;
    }

    const archivo =
        input.files[0];


    // Comprobar que es imagen

    if (
        !archivo.type ||
        !archivo.type.startsWith("image/")
    ) {

        alert(
            "El archivo seleccionado no es una imagen."
        );

        return;
    }


    // Máximo 10 MB

    if (
        archivo.size >
        10 * 1024 * 1024
    ) {

        alert(
            "La foto es demasiado grande. Máximo 10 MB."
        );

        return;
    }


    if (boton) {

        boton.disabled = true;

        boton.textContent =
            "⏳ Subiendo foto...";
    }


    try {

        // --------------------------------
        // CREAR NOMBRE ÚNICO
        // --------------------------------

        const extension =
            archivo.name
                .split(".")
                .pop()
                .toLowerCase();

        const nombreSeguro =
            archivo.name
                .replace(
                    /[^a-zA-Z0-9._-]/g,
                    "_"
                );

        const nombreArchivo =
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 10)}-${nombreSeguro}`;

        const ruta =
            nombreArchivo;


        // --------------------------------
        // SUBIR AL BUCKET
        // --------------------------------

        console.log(
            "Subiendo foto:",
            ruta
        );

        const {
            error: errorSubida
        } =
            await supabaseClient
                .storage
                .from(BUCKET_FOTOS)
                .upload(
                    ruta,
                    archivo,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType:
                            archivo.type
                    }
                );


        if (errorSubida) {

            console.error(
                "Error subiendo imagen:",
                errorSubida
            );

            alert(
                `No se ha podido subir la foto.\n\n${errorSubida.message || ""}`
            );

            return;
        }


        // --------------------------------
        // OBTENER URL PÚBLICA
        // --------------------------------

        const {
            data: urlData
        } =
            supabaseClient
                .storage
                .from(BUCKET_FOTOS)
                .getPublicUrl(
                    ruta
                );


        if (
            !urlData ||
            !urlData.publicUrl
        ) {

            alert(
                "La foto se ha subido, pero no se ha podido obtener su dirección."
            );

            return;
        }


        const url =
            urlData.publicUrl;


        // --------------------------------
        // GUARDAR EN TABLA FOTOS
        // --------------------------------

        const {
            error: errorTabla
        } =
            await supabaseClient
                .from("fotos")
                .insert([
                    {
                        nombre:
                            archivo.name,

                        descripcion:
                            descripcion.value.trim() ||
                            archivo.name,

                        url:
                            url,

                        fecha:
                            new Date()
                                .toISOString()
                                .split("T")[0]
                    }
                ]);


        if (errorTabla) {

            console.error(
                "Error guardando información:",
                errorTabla
            );


            // Intentar borrar la imagen
            // si falla la tabla

            await supabaseClient
                .storage
                .from(BUCKET_FOTOS)
                .remove([
                    ruta
                ]);


            alert(
                `La foto se ha subido, pero no se ha podido guardar.\n\n${errorTabla.message || ""}`
            );

            return;
        }


        // --------------------------------
        // LIMPIAR FORMULARIO
        // --------------------------------

        input.value = "";

        descripcion.value = "";

        if (nombreFoto) {

            nombreFoto.textContent =
                "Ninguna foto seleccionada";
        }


        // --------------------------------
        // ACTUALIZAR GALERÍA
        // --------------------------------

        await cargarFotos();


        alert(
            "❤️ Recuerdo guardado correctamente"
        );

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        alert(
            `Ha ocurrido un error al guardar la foto.\n\n${error.message || error}`
        );

    } finally {

        if (boton) {

            boton.disabled = false;

            boton.textContent =
                "📤 Guardar recuerdo";
        }
    }
}


// ----------------------------------------
// ELIMINAR FOTO
// ----------------------------------------

async function eliminarFoto(id) {

    const confirmar =
        confirm(
            "¿Quieres eliminar este recuerdo? ❤️"
        );

    if (!confirmar) return;


    // Buscar registro

    const {
        data,
        error
    } =
        await supabaseClient
            .from("fotos")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {

        console.error(
            "Error buscando foto:",
            error
        );

        alert(
            "No se ha podido encontrar la foto."
        );

        return;
    }


    // --------------------------------
    // OBTENER RUTA DEL STORAGE
    // --------------------------------

    let ruta = null;

    try {

        const url =
            new URL(
                data.url
            );

        const marcador =
            "/storage/v1/object/public/fotos/";

        const posicion =
            url.pathname.indexOf(
                marcador
            );

        if (posicion !== -1) {

            ruta =
                decodeURIComponent(
                    url.pathname.substring(
                        posicion +
                        marcador.length
                    )
                );
        }

    } catch (error) {

        console.error(
            "No se pudo obtener la ruta:",
            error
        );
    }


    // --------------------------------
    // BORRAR DEL STORAGE
    // --------------------------------

    if (ruta) {

        const {
            error: errorStorage
        } =
            await supabaseClient
                .storage
                .from(BUCKET_FOTOS)
                .remove([
                    ruta
                ]);

        if (errorStorage) {

            console.error(
                "Error eliminando imagen:",
                errorStorage
            );
        }
    }


    // --------------------------------
    // BORRAR DE LA TABLA
    // --------------------------------

    const {
        error: errorTabla
    } =
        await supabaseClient
            .from("fotos")
            .delete()
            .eq(
                "id",
                id
            );

    if (errorTabla) {

        console.error(
            "Error eliminando registro:",
            errorTabla
        );

        alert(
            "No se ha podido eliminar el recuerdo."
        );

        return;
    }


    cargarFotos();
}


// ----------------------------------------
// ABRIR FOTO
// ----------------------------------------

function abrirFoto(url) {

    window.open(
        url,
        "_blank"
    );
}


// ----------------------------------------
// ERROR FOTOS
// ----------------------------------------

function mostrarErrorFotos() {

    const galeria =
        document.getElementById(
            "galeriaFotos"
        );

    if (!galeria) return;

    galeria.innerHTML = `

        <div class="sin-fotos">

            <div class="icono">
                ⚠️
            </div>

            <p>
                No se han podido cargar las fotos.
            </p>

            <small>
                Comprueba los permisos de Supabase.
            </small>

        </div>

    `;
}


// ========================================
// PANEL PRINCIPAL
// ========================================

async function actualizarPanel() {

    const compra =
        await supabaseClient
            .from("productos")
            .select("id");

    const tareas =
        await supabaseClient
            .from("tareas")
            .select("id");

    const agenda =
        await supabaseClient
            .from("agenda")
            .select("id");

    const gastos =
        await supabaseClient
            .from("gastos")
            .select("importe");


    const resumenCompra =
        document.getElementById(
            "resumenCompra"
        );

    const resumenTareas =
        document.getElementById(
            "resumenTareas"
        );

    const resumenAgenda =
        document.getElementById(
            "resumenAgenda"
        );

    const resumenGastos =
        document.getElementById(
            "resumenGastos"
        );


    if (resumenCompra) {

        resumenCompra.textContent =
            compra.data
                ? compra.data.length
                : 0;
    }


    if (resumenTareas) {

        resumenTareas.textContent =
            tareas.data
                ? tareas.data.length
                : 0;
    }


    if (resumenAgenda) {

        resumenAgenda.textContent =
            agenda.data
                ? agenda.data.length
                : 0;
    }


    let total = 0;

    if (gastos.data) {

        gastos.data.forEach(
            (gasto) => {

                total +=
                    Number(
                        gasto.importe
                    ) || 0;

            }
        );
    }


    if (resumenGastos) {

        resumenGastos.textContent =
            `${total
                .toFixed(2)
                .replace(".", ",")
            } €`;
    }
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

cargarFotos();

actualizarPanel();


// ========================================
// TIEMPO REAL
// ========================================

supabaseClient
    .channel(
        "productos-tiempo-real"
    )
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
    .channel(
        "tareas-tiempo-real"
    )
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
    .channel(
        "gastos-tiempo-real"
    )
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
    .channel(
        "agenda-tiempo-real"
    )
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


supabaseClient
    .channel(
        "fotos-tiempo-real"
    )
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "fotos"
        },
        () => {

            cargarFotos();

        }
    )
    .subscribe();