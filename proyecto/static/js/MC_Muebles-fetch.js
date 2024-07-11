const BASEURL = 'http://127.0.0.1:5000/';

/**
 * Función para hacer fetch de datos usando fetch API.
 * @param {string} url 
 * @param {string} method 
 * @param {Object} [data=null] 
 * @returns {Promise<Object>}
 */
async function fetchData(url, method, data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : null,
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    alert('An error occurred while fetching data. Please try again.');
    throw error;  // Propaga el error para que pueda ser manejado fuera de esta función si es necesario
  }
}

/**
 * Event Listener para el botón "Agregar Pedido" o "Actualizar Pedido".
 * Envia datos al backend para agregar o actualizar un pedido.
 */
document.getElementById('agregar-pedido').addEventListener('click', saveDataPedidos);

/**
 * Event Listener para el botón "Eliminar Pedido".
 * Solicita confirmación antes de eliminar un pedido y luego realiza la eliminación.
 */
document.getElementById('eliminar-pedido').addEventListener('click', function() {
  const idPedido = document.querySelector('#id_pedido').value;
  if (idPedido) {
    deletePedido(idPedido);
  } else {
    alert('Seleccione un pedido para eliminar.');
  }
});

/**
 * Función para guardar datos de pedidos.
 * Envia datos al backend para agregar o actualizar un pedido.
 */
async function saveDataPedidos() {
  const idPedido = document.querySelector('#id_pedido').value;
  const Nombre = document.querySelector('#Nombre').value;
  const Apellido = document.querySelector('#Apellido').value;
  const email = document.querySelector('#email').value;
  const Mueble = document.querySelector('#Mueble').value;
  const fechaentrega = document.querySelector('#fecha_entrega').value;
  const Color = document.querySelector('#Color').value;

  if (!Nombre || !Apellido || !email || !Mueble || !fechaentrega || !Color) {
    Swal.fire({
      title: 'Error!',
      text: 'Por favor completa todos los campos.',
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
    return;
  }

  const pedidoData = {
    Nombre: Nombre,
    Apellido: Apellido,
    email: email,
    Mueble: Mueble,
    fecha_entrega: fechaentrega,
    Color: Color,
  };

  try {
    let result = null;
    if (idPedido !== "") {
      result = await fetchData(`${BASEURL}api/pedidos/${idPedido}`, 'PUT', pedidoData);
    } else {
      result = await fetchData(`${BASEURL}api/pedidos/`, 'POST', pedidoData);
    }

    const formPedidos = document.querySelector('#form-pedidos');
    formPedidos.reset();

    Swal.fire({
      title: 'Éxito!',
      text: result ? result.message : 'Operación completada correctamente',
      icon: 'success',
      confirmButtonText: 'Cerrar'
    });

    showPedido();  // Llama a la función showPedido definida correctamente
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    alert('An error occurred while saving data. Please try again.');
  }
}

/**
 * Event Listener para el botón "Actualizar Pedido".
 * Carga los datos del pedido seleccionado en el formulario de edición.
 */
document.getElementById('actualizar-pedido').addEventListener('click', function() {
  const idPedido = document.querySelector('#id_pedido').value;
  if (idPedido) {
    updatePedido(idPedido);
  } else {
    alert('Seleccione un pedido para actualizar.');
  }
});

/**
 * Función para mostrar todos los pedidos en una tabla.
 * Obtiene los pedidos del backend y los muestra en una tabla HTML.
 */
async function showPedido() {
  try {
    let pedidos = await fetchData(`${BASEURL}api/pedidos/`, 'GET');
    const tablePedidos = document.querySelector('#listado-pedidos tbody');
    tablePedidos.innerHTML = '';
    pedidos.forEach((pedido, index) => {
      let tr = `<tr>
                  <td>${pedido.Nombre}</td>
                  <td>${pedido.Apellido}</td>
                  <td>${pedido.email}</td>
                  <td>${pedido.Mueble}</td>
                  <td>${pedido.fecha_entrega}</td>
                  <td>${pedido.Color}</td>
                  <td>
                      <button class="btn-cac" onclick='updatePedido(${pedido.id_pedido})'><i class="fa fa-pencil"></i></button>
                      <button class="btn-cac" onclick='deletePedido(${pedido.id_pedido})'><i class="fa fa-trash"></i></button>
                  </td>
                </tr>`;
      tablePedidos.insertAdjacentHTML("beforeend", tr);
    });
  } catch (error) {
    console.error('Error al mostrar pedidos:', error);
    alert('An error occurred while fetching data. Please try again.');
  }
}

/**
 * Función para eliminar un pedido.
 * @param {number} id - ID del pedido a eliminar.
 */
async function deletePedido(id) {
  Swal.fire({
    title: "¿Está seguro de querer eliminar el pedido?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let response = await fetchData(`${BASEURL}api/pedidos/${id}`, 'DELETE');
        showPedido();  // Actualiza la tabla de pedidos después de eliminar
        Swal.fire(response.message, "", "success");
      } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        alert('An error occurred while deleting data. Please try again.');
      }
    }
  });
}

/**
 * Función para cargar los datos de un pedido en el formulario de edición.
 * @param {number} id - ID del pedido a editar.
 */
async function updatePedido(id) {
  try {
    let response = await fetchData(`${BASEURL}api/pedidos/${id}`, 'GET');

    document.querySelector('#id_pedido').value = response.id_pedido;
    document.querySelector('#Nombre').value = response.Nombre;
    document.querySelector('#Apellido').value = response.Apellido;
    document.querySelector('#email').value = response.email;
    document.querySelector('#Mueble').value = response.Mueble;
    document.querySelector('#fecha_entrega').value = response.fecha_entrega;
    document.querySelector('#Color').value = response.Color;
  } catch (error) {
    console.error('Error al obtener datos del pedido:', error);
    alert('An error occurred while fetching data. Please try again.');
  }
}
