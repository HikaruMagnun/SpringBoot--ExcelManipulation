document.addEventListener("DOMContentLoaded", function () {
  // Variables
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const fileInput = document.getElementById("excel-file");
  const fileDropArea = document.getElementById("file-drop-area");
  const fileName = document.getElementById("file-name");
  const submitBtn = document.getElementById("submit-btn");
  const loading = document.getElementById("loading");
  const alertContainer = document.getElementById("alert-container");
  const resultsContainer = document.getElementById("results-container");

  let reportData = null;

  // Función para cambiar de pestaña
  function switchTab(tabId) {
    tabs.forEach((tab) => {
      tab.classList.remove("active");
      if (tab.getAttribute("data-tab") === tabId) {
        tab.classList.add("active");
      }
    });

    tabContents.forEach((content) => {
      content.classList.remove("active");
      if (content.id === tabId + "-tab") {
        content.classList.add("active");
      }
    });
  }

  // Event listeners para las pestañas
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      switchTab(tabId);

      // Si cambiamos a resultados y hay datos, mostrarlos
      if (tabId === "results" && reportData) {
        displayResults(reportData);
      }
    });
  });

  // Event listeners para el input de archivo
  fileDropArea.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", handleFileSelect);

  // Soporte para drag and drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    fileDropArea.addEventListener(
      eventName,
      () => {
        fileDropArea.style.borderColor = "#2c3e50";
        fileDropArea.style.backgroundColor = "#f9f9f9";
      },
      false
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    fileDropArea.addEventListener(
      eventName,
      () => {
        fileDropArea.style.borderColor = "#aaa";
        fileDropArea.style.backgroundColor = "transparent";
      },
      false
    );
  });

  fileDropArea.addEventListener(
    "drop",
    (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;

      if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
      }
    },
    false
  );

  // Manejar selección de archivo
  function handleFileSelect() {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (!file.name.endsWith(".xls")) {
        showAlert("El archivo debe ser un Excel (.xls)", "danger");
        fileName.textContent = "";
        submitBtn.disabled = true;
        return;
      }

      fileName.textContent = file.name;
      submitBtn.disabled = false;
      clearAlert();
    } else {
      fileName.textContent = "";
      submitBtn.disabled = true;
    }
  }

  // Evento para enviar el archivo
  submitBtn.addEventListener("click", submitFile);

  // Función para enviar el archivo
  function submitFile() {
    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("excel", file);

    // Mostrar loading
    loading.style.display = "block";
    submitBtn.disabled = true;
    clearAlert();

    fetch("http://localhost:8080/validateExcel", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Error al procesar el archivo");
          });
        }
        return response.json();
      })
      .then((data) => {
        // Guardar datos y mostrar pestaña de resultados
        reportData = data;
        loading.style.display = "none";
        submitBtn.disabled = false;

        showAlert("Archivo procesado correctamente", "success");
        switchTab("results");
        displayResults(data);
      })
      .catch((error) => {
        loading.style.display = "none";
        submitBtn.disabled = false;
        showAlert(error.message, "danger");
      });
  }

  // Función para mostrar alertas
  function showAlert(message, type) {
    alertContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
  }

  // Función para limpiar alertas
  function clearAlert() {
    alertContainer.innerHTML = "";
  }

  // Función para mostrar resultados
  function displayResults(data) {
    let resultsHTML = `
            <div class="summary">
                <h3>Resumen</h3>
                <p><strong>Total de Filas:</strong> ${data.totalRows}</p>
                <p><strong>Filas Válidas:</strong> ${data.validRows}</p>
                <p><strong>Filas Duplicadas:</strong> ${
                  data.duplicatedRows ? data.duplicatedRows.length : 0
                }</p>
            </div>
        `;

    if (data.duplicatedRows && data.duplicatedRows.length > 0) {
      resultsHTML += `
                <h3>Filas Duplicadas</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fila</th>
                                <th>Código de Operación</th>
                                <th>Descripción de Operación</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

      data.duplicatedRows.forEach((row) => {
        resultsHTML += `
                    <tr>
                        <td>${row.rowNumber}</td>
                        <td>${
                          row.codeOperation !== null ? row.codeOperation : "-"
                        }</td>
                        <td>${row.descriptionOperation || "-"}</td>
                    </tr>
                `;
      });

      resultsHTML += `
                        </tbody>
                    </table>
                </div>
            `;
    } else if (data.totalRows > 0) {
      resultsHTML += `
                <div class="alert alert-success">
                    <strong>¡Excelente!</strong> No se encontraron filas duplicadas en el archivo.
                </div>
            `;
    }

    resultsContainer.innerHTML = resultsHTML;
  }
});
