document.addEventListener("DOMContentLoaded", function() {
    const userForm = document.getElementById('userForm');
    const userList = document.getElementById('users');
    const modalUserDetails = document.getElementById('modalUserDetails');
    const confirmAddUser = document.getElementById('confirmAddUser');
    const formErrors = document.getElementById('formErrors');
    const noUsersMessage = document.getElementById('noUsersMessage'); // Selecciona el mensaje
    let users = [];
    let userToAdd = null;

    // Inicialmente verificar si hay usuarios para mostrar el mensaje correspondiente
    toggleNoUsersMessage();

    userForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            const name = document.getElementById('name').value.trim();
            const surname = document.getElementById('surname').value.trim();
            const email = document.getElementById('email').value.trim();
            const position = document.getElementById('position').value;
            const entryDate = document.getElementById('entry-date').value;
            userToAdd = { name, surname, email, position, entryDate };
            modalUserDetails.innerText = `Nombre: ${name}\nApellido: ${surname}\nCorreo: ${email}\nCargo: ${position}\nFecha de Ingreso: ${entryDate}`;
            $('#confirmationModal').modal('show');
        }
    });

    confirmAddUser.addEventListener('click', function() {
        if (userToAdd) {
            addUser(userToAdd);
            $('#confirmationModal').modal('hide');
            userForm.reset();
            formErrors.innerHTML = '';
        }
    });

    function isValidName(name) {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Acepta letras y espacios
        return regex.test(name);
    }

    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const email = document.getElementById('email').value.trim();
        const entryDate = new Date(document.getElementById('entry-date').value);
        const birthDate = new Date(document.getElementById('birth-date').value);
        const age = new Date().getFullYear() - birthDate.getFullYear();

        let errors = '';
        if (!name || !surname || !email || !entryDate || !birthDate) {
            errors += 'Por favor complete todos los campos.<br>';
        }
        if (!isValidName(name)) {
            errors += 'El nombre solo debe contener letras.<br>';
        }
        if (!isValidName(surname)) {
            errors += 'El apellido solo debe contener letras.<br>';
        }
        if (users.some(user => user.email === email)) {
            errors += 'El correo electrónico ya está registrado.<br>';
        }
        if (age < 18) {
            errors += 'El trabajador debe tener al menos 18 años.<br>';
        }
        if (entryDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18))) {
            errors += 'La fecha de ingreso debe ser mayor a 18 años de edad.<br>';
        }

        formErrors.innerHTML = errors;
        return errors === '';
    }

    function addUser(user) {
        users.push(user);
        renderUserList();
        userToAdd = null; // Limpiar la variable
    }

    function renderUserList() {
        userList.innerHTML = '';
        users.forEach((user, index) => {
            const userCard = document.createElement('div');
            userCard.classList.add('col-md-3', 'user-card'); // Cuatro columnas
            userCard.innerHTML = `
                <h5>${user.name} ${user.surname}</h5>
                <p><strong>Correo:</strong> ${user.email}</p>
                <p><strong>Cargo:</strong> ${user.position}</p>
                <p><strong>Fecha de Ingreso:</strong> ${user.entryDate}</p>
                <button class="btn btn-danger btn-sm" onclick="removeUser(${index})">Eliminar</button>
            `;
            userList.appendChild(userCard);
        });

        // Actualizar la visibilidad del mensaje de "No hay trabajadores"
        toggleNoUsersMessage();
    }

    function toggleNoUsersMessage() {
        if (users.length === 0) {
            noUsersMessage.style.display = 'block'; // Mostrar el mensaje si no hay usuarios
        } else {
            noUsersMessage.style.display = 'none'; // Ocultar el mensaje si hay usuarios
        }
    }

    window.removeUser = function(index) {
        users.splice(index, 1);
        renderUserList();
    }

    window.onscroll = function() {
        const navbar = document.querySelector('.navbar');
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
});
