const form = document.getElementById('form');
const messageTag = document.getElementById('message');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const notification = document.getElementById('notification');
const submitBtn = document.getElementById('submit');

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

form.style.display = 'none';

let token, id;

window.addEventListener('DOMContentLoaded', async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop);
        },
    });

    token = params.token;
    id = params.id;

    console.log(id);
    console.log(token);

    const res = await fetch('/auth/verify-pass-reset-token', {
        method: 'POST',
        body: JSON.stringify({ token, id }),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    })

    if (!res.ok) {
        const { message } = await res.json();
        messageTag.innerText = message;
        messageTag.classList.add('error');
        return;
    }

    messageTag.style.display = 'none';
    form.style.display = 'block';
});


const displayNotification = (message, type) => {
    notification.style.display = 'block';
    notification.innerText = message;
    notification.classList.add(type)
};


const handleSubmit = async (evt) => {
    evt.preventDefault()

    // validate
    if (!passwordRegex.test(password.value)) {
        return displayNotification('Invalid password use numeric and special characters!', 'error');
    }

    if (password.value !== confirmPassword.value) {
        return displayNotification('Password do not match!', 'error');
    }

    // submit the form
    submitBtn.disabled = true;
    submitBtn.innerText = 'Please wait...';

    const res = await fetch('/auth/reset-pass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ id, token, password: password.value }),
    });

    submitBtn.disabled = false;
    submitBtn.innerText = 'Update Password!';

    if (!res.ok) {
        const { message } = await res.json();
        displayNotification(message, 'error');
    }

    messageTag.style.display = 'block';
    messageTag.innerText = 'Your password updated successfully!';
    form.style.display = 'none';
};

form.addEventListener('submit', handleSubmit)