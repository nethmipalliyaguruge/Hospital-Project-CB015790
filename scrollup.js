document.addEventListener('DOMContentLoaded', () => {
    const topButton = document.querySelector('.btn_top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight / 2) {
            topButton.style.display = 'block';
        } else {
            topButton.style.display = 'none';
        }
    });
});