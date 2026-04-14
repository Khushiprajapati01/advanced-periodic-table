const passwordInput = document.getElementById('password');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const historyList = document.getElementById('historyList');

const upperCheck = document.getElementById('upper');
const lowerCheck = document.getElementById('lower');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');

let passwordHistory = [];

// Update length value
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Generate Password
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const includeUpper = upperCheck.checked;
    const includeLower = lowerCheck.checked;
    const includeNumbers = numbersCheck.checked;
    const includeSymbols = symbolsCheck.checked;

    let charset = '';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+[]{}|;:,.<>?';

    if (charset === '') {
        alert("Please select at least one character type!");
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    passwordInput.value = password;
    updateStrengthMeter(password);
    addToHistory(password);
}

// Strength Meter
function updateStrengthMeter(password) {
    let strength = 0;
    const length = password.length;

    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    let percentage = (strength / 5) * 100;
    strengthBar.style.width = percentage + '%';

    if (percentage <= 40) {
        strengthBar.style.background = 'linear-gradient(90deg, #ff0000, #ff8800)';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#ff8800';
    } else if (percentage <= 70) {
        strengthBar.style.background = 'linear-gradient(90deg, #ff8800, #ffd700)';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#ffd700';
    } else {
        strengthBar.style.background = 'linear-gradient(90deg, #ffd700, #00ff88)';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#00ff88';
    }
}

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    if (!password) return;

    navigator.clipboard.writeText(password).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#00ff88';

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 1500);
    });
});

// Add to History
function addToHistory(password) {
    passwordHistory.unshift(password);
    if (passwordHistory.length > 5) passwordHistory.pop();

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    passwordHistory.forEach(pass => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${pass}
            <button class="copy-small" onclick="copyFromHistory('${pass}')">Copy</button>
        `;
        historyList.appendChild(li);
    });
}

window.copyFromHistory = function(password) {
    navigator.clipboard.writeText(password);
    alert('Password copied!');
};

// Generate Button
generateBtn.addEventListener('click', generatePassword);

// Initial password generate
generatePassword();