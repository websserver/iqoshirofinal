function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function calculateAge(birthMonth, birthYear) {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Verificar idade ao carregar qualquer página
window.onload = function() {
    // Não verificar na própria página de verificação de idade
    if (window.location.href.includes('age-verification.html')) {
        return;
    }

    const ageVerified = getCookie('age_verified');
    if (!ageVerified) {
        window.location.href = 'age-verification.html';
        return;
    }

    const birthMonth = getCookie('birth_month');
    const birthYear = getCookie('birth_year');
    const age = calculateAge(birthMonth, birthYear);
    
    if (age < 18) {
        window.location.href = 'https://www.google.com';
    }
}; 