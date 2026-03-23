function go(id) {
    // إخفاء كل الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // إظهار الشاشة المطلوبة
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
}

function startGame() {
    alert("🚀 سيتم بدء اللعبة لاحقًا");
}
