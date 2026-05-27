document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM - Formulario e Inputs
  const form = document.getElementById('person-form');
  const inputId = document.getElementById('input-id');
  const inputName = document.getElementById('input-name');
  const inputAge = document.getElementById('input-age');
  const btnSubmit = document.getElementById('btn-submit');
  const formFeedback = document.getElementById('form-feedback');

  // Elementos del DOM - Mensajes de Error de Formulario
  const errorId = document.getElementById('error-id');
  const errorName = document.getElementById('error-name');
  const errorAge = document.getElementById('error-age');

  // Elementos del DOM - Tabla y Estadísticas
  const tableBody = document.getElementById('table-body');
  const statTotal = document.getElementById('stat-total');
  const statAvg = document.getElementById('stat-avg');

  // Array de personas en el cliente
  let peopleList = [];

  // Función para obtener todos los registros del servidor
  async function fetchPeople() {
    try {
      showTableLoading();
      const response = await fetch('/api/people');
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos del servidor.');
      }
      peopleList = await response.json();
      renderTable();
      updateStatistics();
    } catch (error) {
      console.error(error);
      showTableError();
    }
  }

  // Función para renderizar la tabla con la lista de personas
  function renderTable() {
    tableBody.innerHTML = '';

    if (peopleList.length === 0) {
      tableBody.innerHTML = `
        <tr class="table-empty">
          <td colspan="3">
            <div class="table-empty-icon"><i class="fa-regular fa-folder-open"></i></div>
            No hay registros disponibles.
          </td>
        </tr>
      `;
      return;
    }

    peopleList.forEach(person => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-weight: 600; color: var(--accent-cyan);">${escapeHTML(person.id)}</td>
        <td>${escapeHTML(person.name)}</td>
        <td style="font-weight: 500;">${person.age} años</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Calcular y actualizar estadísticas en la UI
  function updateStatistics() {
    const total = peopleList.length;
    statTotal.textContent = total;

    if (total === 0) {
      statAvg.textContent = '0';
      return;
    }

    const sumAge = peopleList.reduce((acc, curr) => acc + curr.age, 0);
    const avg = (sumAge / total).toFixed(1);
    statAvg.textContent = `${avg} años`;
  }

  // Mostrar indicador de carga en la tabla
  function showTableLoading() {
    tableBody.innerHTML = `
      <tr class="table-loading">
        <td colspan="3">
          <div class="spinner"></div>
          Consultando API de Personas...
        </td>
      </tr>
    `;
  }

  // Mostrar mensaje de error en la tabla
  function showTableError() {
    tableBody.innerHTML = `
      <tr class="table-empty">
        <td colspan="3" style="color: var(--accent-error);">
          <div class="table-empty-icon" style="color: var(--accent-error);"><i class="fa-solid fa-triangle-exclamation"></i></div>
          Error al conectar con la API. Intente de nuevo.
        </td>
      </tr>
    `;
  }

  // Sanitizar entradas para evitar XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Limpiar errores visuales
  function clearErrors() {
    errorId.textContent = '';
    errorName.textContent = '';
    errorAge.textContent = '';
    inputId.style.borderColor = '';
    inputName.style.borderColor = '';
    inputAge.style.borderColor = '';
  }

  // Mostrar toast de feedback
  function showFeedback(message, type = 'success') {
    formFeedback.textContent = '';
    formFeedback.className = `feedback-toast ${type}`;
    
    const icon = document.createElement('i');
    if (type === 'success') {
      icon.className = 'fa-solid fa-circle-check';
    } else {
      icon.className = 'fa-solid fa-circle-exclamation';
    }
    
    formFeedback.appendChild(icon);
    formFeedback.appendChild(document.createTextNode(` ${message}`));
    
    formFeedback.classList.remove('hidden');

    // Desaparecer después de 5 segundos
    setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  }

  // Escuchar cambios en los inputs para limpiar errores en tiempo real
  inputId.addEventListener('input', () => {
    errorId.textContent = '';
    inputId.style.borderColor = '';
  });
  inputName.addEventListener('input', () => {
    errorName.textContent = '';
    inputName.style.borderColor = '';
  });
  inputAge.addEventListener('input', () => {
    errorAge.textContent = '';
    inputAge.style.borderColor = '';
  });

  // Manejo de envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const idVal = inputId.value.trim();
    const nameVal = inputName.value.trim();
    const ageVal = inputAge.value.trim();

    // Validaciones en Frontend antes de enviar
    let hasErrors = false;

    if (!idVal) {
      errorId.textContent = 'El ID es obligatorio.';
      inputId.style.borderColor = 'var(--accent-error)';
      hasErrors = true;
    }

    if (!nameVal) {
      errorName.textContent = 'El Nombre es obligatorio.';
      inputName.style.borderColor = 'var(--accent-error)';
      hasErrors = true;
    }

    if (!ageVal) {
      errorAge.textContent = 'La Edad es obligatoria.';
      inputAge.style.borderColor = 'var(--accent-error)';
      hasErrors = true;
    } else {
      const ageNum = parseInt(ageVal, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        errorAge.textContent = 'La edad debe estar entre 0 y 150 años.';
        inputAge.style.borderColor = 'var(--accent-error)';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      showFeedback('Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    // Deshabilitar botón durante el envío
    btnSubmit.disabled = true;
    const btnText = btnSubmit.querySelector('span');
    const originalText = btnText.textContent;
    btnText.textContent = 'Guardando...';

    try {
      const response = await fetch('/api/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: idVal,
          name: nameVal,
          age: parseInt(ageVal, 10)
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        // Registro exitoso
        showFeedback(`¡${data.name} registrado con éxito!`, 'success');
        form.reset();
        fetchPeople(); // Recargar tabla
      } else {
        // Errores de API (ej. ID duplicado u otra validación)
        if (response.status === 409) {
          errorId.textContent = data.error;
          inputId.style.borderColor = 'var(--accent-error)';
        }
        showFeedback(data.error || 'Ocurrió un error al procesar el registro.', 'error');
      }
    } catch (error) {
      console.error(error);
      showFeedback('Error de red al intentar conectar con el servidor.', 'error');
    } finally {
      // Re-habilitar botón
      btnSubmit.disabled = false;
      btnText.textContent = originalText;
    }
  });

  // Inicializar cargando datos
  fetchPeople();
});
