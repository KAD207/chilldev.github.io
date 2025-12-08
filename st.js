// Lấy danh sách user từ Local Storage 
let users = JSON.parse(localStorage.getItem('todoApp_users')) || [];
let currentUser = null; // Biến lưu người đang đăng nhập

// Hàm hiển thị thông báo (Toast)
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.className = "show";
    toast.innerText = message;
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Hàm chuyển đổi giữa các màn hình
function showScreen(screenId) {
    // Ẩn tất cả các screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Hiện screen được chọn
    document.getElementById(screenId).classList.add('active');
}

// --- CHỨC NĂNG ĐĂNG KÝ / ĐĂNG NHẬP ---
function handleRegister() {
    const userIn = document.getElementById('reg-username').value.trim();
    const passIn = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-confirm-password').value;

    if (!userIn || !passIn) {
        showToast("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (passIn !== confirmPass) {
        showToast("Mật khẩu nhập lại không khớp!");
        return;
    }

    // Kiểm tra xem tên đăng nhập đã tồn tại chưa
    const exists = users.find(u => u.username === userIn);
    if (exists) {
        showToast("Tên đăng nhập này đã có người dùng!");
        return;
    }

    // Tạo user mới
    const newUser = {
        username: userIn,
        password: passIn,
        todos: [] // Mỗi user có một danh sách todo riêng
    };

    users.push(newUser);
    saveData(); // Lưu vào Local Storage
    showToast("Đăng ký thành công! Hãy đăng nhập.");
    showScreen('login-section');
}

function handleLogin() {
    const userIn = document.getElementById('login-username').value.trim();
    const passIn = document.getElementById('login-password').value;

    // Tìm user trong danh sách
    const user = users.find(u => u.username === userIn && u.password === passIn);

    if (user) {
        currentUser = user; // Gán user hiện tại
        document.getElementById('user-display').innerText = currentUser.username;
        renderTodos(); // Load danh sách todo của user này
        showScreen('home-section');
        showToast("Chào mừng quay trở lại!");
    } else {
        showToast("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

function handleLogout() {
    currentUser = null;
    showScreen('login-section');
    showToast("Đã đăng xuất.");
}

// --- CHỨC NĂNG TODO LIST ---
function saveData() {
    // Lưu mảng users vào Local Storage
    localStorage.setItem('todoApp_users', JSON.stringify(users));
}

function renderTodos() {
    const list = document.getElementById('todo-list');
list.innerHTML = ''; // Xóa trắng danh sách cũ

    // Duyệt qua mảng todos của người dùng hiện tại
    currentUser.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <span onclick="toggleTodo(${index})">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">Xóa</button>
        `;
        list.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();

    if (!text) {
        showToast("Bạn chưa nhập nội dung!");
        return;
    }

    // Thêm todo mới vào đầu mảng
    currentUser.todos.unshift({
        text: text,
        completed: false
    });

    saveData(); // Quan trọng: lưu ngay vào Local Storage
    renderTodos();
    input.value = ''; // Reset ô nhập
}

function deleteTodo(index) {
    if (confirm("Bạn có chắc muốn xóa không?")) {
        currentUser.todos.splice(index, 1); // Xóa 1 phần tử tại vị trí index
        saveData();
        renderTodos();
    }
}

function toggleTodo(index) {
    // Đảo ngược trạng thái hoàn thành (true <-> false)
    currentUser.todos[index].completed = !currentUser.todos[index].completed;
    saveData();
    renderTodos();
}

// --- CHỨC NĂNG CÀI ĐẶT / GÓP Ý ---
function changePassword() {
    const newPass = document.getElementById('new-password').value;
    if (newPass.length < 3) {
        showToast("Mật khẩu quá ngắn!");
        return;
    }
    currentUser.password = newPass; // Cập nhật mật khẩu
    saveData();
    showToast("Đổi mật khẩu thành công!");
    document.getElementById('new-password').value = '';
}

function sendFeedback() {
    const content = document.getElementById('feedback-content').value;
    if (!content) return;
    
    // Ở đây vì không có Server thật, chỉ giả vờ gửi thôi
    alert(`Cảm ơn ${currentUser.username} đã góp ý: "${content}"`);
    document.getElementById('feedback-content').value = '';
}