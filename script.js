/* ========================================

  MOT OCARE - FUNCIONES DE LA APLICACIÓN

  ======================================== */

// Elementos principales de la página

const loginScreen = document.getElementById("login-screen");

const app = document.getElementById("app");

const loginForm = document.getElementById("login-form");

const logoutButton = document.getElementById("logout-button");

const toast = document.getElementById("toast");

// Lista temporal de mantenimientos.

// Los datos se mantienen mientras la página permanezca abierta.

let maintenanceRecords = [];

let nextRecordId = 1;

// Fecha actual en formato YYYY-MM-DD, usando la fecha local.

function getTodayDate() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Inicializar elementos al cargar la página.

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  document.getElementById("service-date").value = getTodayDate();

  updateMaintenanceViews();
});

// ========================================

// MENSAJES DE CONFIRMACIÓN

// ========================================

let toastTimeout;

function showToast(message) {
  toast.textContent = message;

  toast.classList.remove("hidden");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// ========================================

// INICIO Y CIERRE DE SESIÓN DE DEMOSTRACIÓN

// ========================================

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();

  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Completa el correo y la contraseña.");

    return;
  }

  // Es una demostración visual: no valida credenciales en un servidor.

  loginScreen.classList.add("hidden");

  app.classList.remove("hidden");

  showPage("inicio");

  showToast("¡Bienvenido a MotoCare!");
});

logoutButton.addEventListener("click", () => {
  app.classList.add("hidden");

  loginScreen.classList.remove("hidden");

  loginForm.reset();

  showToast("Has salido de MotoCare.");
});

const hamburgerButton = document.getElementById("hamburger-button");
const mainNavigation = document.getElementById("main-navigation");

function closeHamburgerMenu() {
  if (!hamburgerButton || !mainNavigation) return;

  mainNavigation.classList.remove("is-open");
  hamburgerButton.classList.remove("is-active");
  hamburgerButton.setAttribute("aria-expanded", "false");
  hamburgerButton.setAttribute("aria-label", "Abrir menú de navegación");
}

if (hamburgerButton && mainNavigation) {
  hamburgerButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("is-open");

    hamburgerButton.classList.toggle("is-active", isOpen);
    hamburgerButton.setAttribute("aria-expanded", String(isOpen));
  });
}

// ========================================

// NAVEGACIÓN ENTRE SECCIONES

// ========================================

function showPage(pageName) {
  const validPages = [
    "inicio",

    "mi-moto",

    "mantenimientos",

    "registrar",

    "galeria",

    "consejos",
  ];

  if (!validPages.includes(pageName)) {
    pageName = "inicio";
  }

  // Mostrar solo la sección seleccionada.

  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.add("hidden");
  });

  const selectedPage = document.getElementById(`page-${pageName}`);

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  // Actualizar el estado visual del menú.

  document.querySelectorAll(".main-nav [data-page-link]").forEach((link) => {
    link.classList.toggle(
      "active",

      link.dataset.pageLink === pageName
    );
  });

  const hamburgerButton = document.getElementById("hamburger-button");
  const mainNavigation = document.getElementById("main-navigation");

  function closeHamburgerMenu() {
    if (!hamburgerButton || !mainNavigation) return;

    mainNavigation.classList.remove("is-open");
    hamburgerButton.classList.remove("is-active");
    hamburgerButton.setAttribute("aria-expanded", "false");
    hamburgerButton.setAttribute("aria-label", "Abrir menú de navegación");
  }

  if (hamburgerButton && mainNavigation) {
    hamburgerButton.addEventListener("click", () => {
      const isOpen = mainNavigation.classList.toggle("is-open");

      hamburgerButton.classList.toggle("is-active", isOpen);
      hamburgerButton.setAttribute("aria-expanded", String(isOpen));
      hamburgerButton.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      );
    });
  }

  // Cerrar el submenú después de elegir una opción.

  closeMaintenanceMenu();

  // Actualizar el hash de la dirección sin recargar la página.

  if (window.location.hash !== `#${pageName}`) {
    history.replaceState(null, "", `#${pageName}`);
  }

  // Llevar la vista al inicio del contenido.

  document.querySelector(".main-content").scrollIntoView({
    behavior: "smooth",

    block: "start",
  });
}

// Los enlaces del menú y del footer llevan a la sección correspondiente.

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    showPage(link.dataset.pageLink);
  });
});

// Botones que llevan a otras secciones.

document.querySelectorAll("[data-go-page]").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.goPage);
  });
});

// ========================================

// SUBMENÚ VERTICAL DESPLEGABLE

// ========================================

const maintenanceMenuButton = document.getElementById(
  "maintenance-menu-button"
);

const maintenanceSubmenu = document.getElementById("maintenance-submenu");

maintenanceMenuButton.addEventListener("click", () => {
  const isOpen = !maintenanceSubmenu.classList.contains("hidden");

  maintenanceSubmenu.classList.toggle("hidden", isOpen);

  maintenanceMenuButton.setAttribute("aria-expanded", String(!isOpen));
});

function closeMaintenanceMenu() {
  maintenanceSubmenu.classList.add("hidden");

  maintenanceMenuButton.setAttribute("aria-expanded", "false");
}

// Cerrar el submenú si se hace clic fuera de él.

document.addEventListener("click", (event) => {
  const clickedInsideMenu = event.target.closest(".nav-dropdown");

  if (!clickedInsideMenu) {
    closeMaintenanceMenu();
  }
});

// Si se abre la página con un hash válido, mostrar esa sección.

window.addEventListener("load", () => {
  const pageFromHash = window.location.hash.replace("#", "");

  if (pageFromHash.startsWith("page-")) {
    showPage(pageFromHash.replace("page-", ""));
  } else if (pageFromHash) {
    showPage(pageFromHash);
  }
});

// ========================================

// ACTUALIZAR LOS DATOS DE MI MOTO

// ========================================

const bikeForm = document.getElementById("bike-form");

bikeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const brand = document.getElementById("bike-brand").value.trim();

  const model = document.getElementById("bike-model").value.trim();

  const year = document.getElementById("bike-year").value;

  const km = Number(document.getElementById("bike-km").value);

  if (!brand || !model || !year || km < 0 || !Number.isFinite(km)) {
    showToast("Revisa los datos de tu motocicleta.");

    return;
  }

  const bikeName = `${brand} ${model}`;

  document.getElementById("bike-title").textContent = bikeName;

  document.getElementById("dashboard-bike").textContent = bikeName;

  showToast("Datos de la motocicleta actualizados.");
});

// ========================================

// REGISTRAR UN MANTENIMIENTO

// ========================================

const maintenanceForm = document.getElementById("maintenance-form");

maintenanceForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const type = document.getElementById("service-type").value;

  const date = document.getElementById("service-date").value;

  const km = Number(document.getElementById("service-km").value);

  const cost = Number(document.getElementById("service-cost").value);

  const description = document

    .getElementById("service-description")

    .value.trim();

  if (
    !type ||
    !date ||
    !description ||
    !Number.isFinite(km) ||
    !Number.isFinite(cost) ||
    km < 0 ||
    cost < 0
  ) {
    showToast("Completa todos los campos correctamente.");

    return;
  }

  const record = {
    id: nextRecordId++,

    type,

    date,

    km,

    cost,

    description,
  };

  maintenanceRecords.push(record);

  updateMaintenanceViews();

  maintenanceForm.reset();

  document.getElementById("service-date").value = getTodayDate();

  showPage("mantenimientos");

  showToast("Mantenimiento registrado correctamente.");
});

// ========================================

// FORMATEAR FECHAS Y MONEDA

// ========================================

function formatDate(dateString) {
  if (!dateString) return "—";

  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",

    currency: "PEN",
  }).format(amount);
}

// ========================================

// MOSTRAR REGISTROS EN LA TABLA

// ========================================

const maintenanceTableBody = document.getElementById("maintenance-table-body");

function renderMaintenanceTable() {
  const searchTerm = document

    .getElementById("maintenance-search")

    .value.trim()

    .toLowerCase();

  const selectedType = document.getElementById("maintenance-filter").value;

  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.type.toLowerCase().includes(searchTerm) ||
      record.description.toLowerCase().includes(searchTerm);

    const matchesType =
      selectedType === "todos" || record.type === selectedType;

    return matchesSearch && matchesType;
  });

  maintenanceTableBody.replaceChildren();

  if (filteredRecords.length === 0) {
    const row = document.createElement("tr");

    const cell = document.createElement("td");

    cell.colSpan = 6;

    cell.className = "empty-state";

    cell.textContent =
      maintenanceRecords.length === 0
        ? "No hay registros. Agrega tu primer mantenimiento."
        : "No se encontraron registros con esos filtros.";

    row.appendChild(cell);

    maintenanceTableBody.appendChild(row);

    return;
  }

  // Mostrar primero los registros más recientes.

  const orderedRecords = [...filteredRecords].sort((a, b) => {
    return b.date.localeCompare(a.date) || b.id - a.id;
  });

  orderedRecords.forEach((record) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");

    dateCell.textContent = formatDate(record.date);

    const typeCell = document.createElement("td");

    typeCell.textContent = record.type;

    const kmCell = document.createElement("td");

    kmCell.textContent = `${record.km.toLocaleString("es-PE")} km`;

    const costCell = document.createElement("td");

    costCell.textContent = formatCurrency(record.cost);

    const descriptionCell = document.createElement("td");

    descriptionCell.textContent = record.description;

    const actionCell = document.createElement("td");

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-button";

    deleteButton.textContent = "Eliminar";

    deleteButton.setAttribute(
      "aria-label",

      `Eliminar mantenimiento del ${formatDate(record.date)}`
    );

    deleteButton.addEventListener("click", () => {
      deleteMaintenance(record.id);
    });

    actionCell.appendChild(deleteButton);

    row.append(
      dateCell,

      typeCell,

      kmCell,

      costCell,

      descriptionCell,

      actionCell
    );

    maintenanceTableBody.appendChild(row);
  });
}

// ========================================

// MOSTRAR LOS ÚLTIMOS MANTENIMIENTOS

// ========================================

function renderRecentMaintenance() {
  const recentList = document.getElementById("recent-maintenance-list");

  recentList.replaceChildren();

  const recentRecords = [...maintenanceRecords]

    .sort((a, b) => {
      return b.date.localeCompare(a.date) || b.id - a.id;
    })

    .slice(0, 4);

  if (recentRecords.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-state";

    emptyMessage.textContent = "Todavía no tienes mantenimientos registrados.";

    recentList.appendChild(emptyMessage);

    return;
  }

  recentRecords.forEach((record) => {
    const item = document.createElement("div");

    item.className = "recent-item";

    const details = document.createElement("div");

    const title = document.createElement("h3");

    title.textContent = record.type;

    const description = document.createElement("p");

    description.textContent = `${formatDate(
      record.date
    )} · ${record.km.toLocaleString("es-PE")} km`;

    const cost = document.createElement("span");

    cost.className = "recent-cost";

    cost.textContent = formatCurrency(record.cost);

    details.append(title, description);

    item.append(details, cost);

    recentList.appendChild(item);
  });
}

// ========================================

// ELIMINAR UN MANTENIMIENTO

// ========================================

function deleteMaintenance(recordId) {
  const confirmed = window.confirm(
    "¿Estás seguro de que deseas eliminar este registro?"
  );

  if (!confirmed) return;

  maintenanceRecords = maintenanceRecords.filter(
    (record) => record.id !== recordId
  );

  updateMaintenanceViews();

  showToast("Registro eliminado.");
}

// ========================================

// ACTUALIZAR EL PANEL Y LOS FILTROS

// ========================================

function updateMaintenanceViews() {
  renderMaintenanceTable();

  renderRecentMaintenance();

  document.getElementById("maintenance-count").textContent =
    maintenanceRecords.length;

  // Obtener la fecha del próximo servicio pendiente, si existe.

  // En esta demostración se deja como "Por programar" porque no se

  // registra una fecha futura de mantenimiento.

  document.getElementById("next-maintenance").textContent = "Por programar";
}

// Actualizar la tabla al escribir una búsqueda o cambiar el filtro.

document.getElementById("maintenance-search").addEventListener(
  "input",

  renderMaintenanceTable
);

document.getElementById("maintenance-filter").addEventListener(
  "change",

  renderMaintenanceTable
);
