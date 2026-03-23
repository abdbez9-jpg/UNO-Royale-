body {
    margin: 0;
    background: black;
    font-family: Arial;
    display: flex;
    justify-content: center;
}

.game-viewport {
    width: 360px;
    height: 640px;
    background: #111;
    border-radius: 20px;
    padding: 20px;
}

/* الشاشات */
.screen {
    display: none;
}

.screen.active {
    display: block;
}

/* اللاعب */
.player-card {
    display: flex;
    gap: 10px;
    align-items: center;
}

.avatar {
    width: 40px;
    border-radius: 50%;
}

.name {
    color: white;
}

.level {
    color: gray;
    font-size: 12px;
}

/* العنوان */
.logo {
    text-align: center;
    color: red;
}

/* الأزرار */
.menu {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

button {
    padding: 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
