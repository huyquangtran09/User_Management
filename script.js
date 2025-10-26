//Tạo tên biến cho nút "Thêm Người Dùng Mới"
const addUserBtn = document.getElementById("add-user-btn");
const userDialog = document.getElementById("user-dialog");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const userForm = document.getElementById("user-form");
const nameError = document.getElementById("name-error");
const phoneError = document.getElementById("phone-error");
const usersGrid = document.getElementById("users-grid");
const emptyState = document.getElementById("empty-state");

// Thêm sự kiện click cho nút "Thêm Người Dùng Mới"
addUserBtn.addEventListener("click", () => {
  userDialog.showModal();
});

//Tạo mảng dữ liệu người dùng
let users = [];

//tải dữ liệu người dùng khi trang được tải
window.addEventListener("load", () => {
  const storedUsers = JSON.parse(localStorage.getItem("users"));
  if (storedUsers) {
    users = storedUsers;
  }
  renderUserList();
});

//mở dialog khi nhấn nút "Thêm Người Dùng Mới"
addUserBtn.addEventListener("click", () => {
  userDialog.showModal();
  document.getElementById("dialog-title").textContent = "Thêm Người Dùng Mới";
  userForm.reset();
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  nameError.style.display = "none";
  phoneError.style.display = "none";
});

//nút hủy
cancelBtn.addEventListener("click", () => {
  userDialog.close();
});

// Tạo sự kiện xử lý onSubmit cho userForm
userForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của form

  //lấy giá trị từ các trường input
  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;

  //Tên phải ≥ 2 ký tự
  if (name.length < 2) {
    nameError.textContent = "Tên phải có ít nhất 2 ký tự.";
    nameError.style.display = "block";
  }
  //và số điện thoại phải là số và có độ dài từ 10-12 ký tự
  const phoneRegex = /^\d{10,12}$/;
  if (!phoneRegex.test(phone)) {
    phoneError.textContent =
      "Số điện thoại phải là số và có độ dài từ 10-12 ký tự.";
    phoneError.style.display = "block";
  }

  //tạo đối tượng người dùng mới
  const newUser = {
    id: Date.now(), //sử dụng timestamp làm id duy nhất
    name: name,
    email: email,
    phone: phone,
  };
  //thêm người dùng mới vào mảng users
  users.push(newUser);
  console.log("Người dùng mới đã được thêm:", newUser);

  //lưu trữ mảng users vào localStorage
  localStorage.setItem("users", JSON.stringify(users));

  //gọi renderUserList để cập nhật danh sách người dùng hiển thị
  renderUserList();

  //Đóng dialog sau khi thêm người dùng
  userDialog.close();
});

// Hàm để hiển thị danh sách người dùng
function renderUserList() {
  // Xóa nội dung hiện tại trong lưới người dùng
  usersGrid.innerHTML = "";

  // Hiển thị danh sách người dùng
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.innerHTML = `
      <div class="user-name">${user.name}</div>
      <div class="user-detail"><strong>Email:</strong> ${user.email}</div>
      <div class="user-detail"><strong>Điện thoại:</strong> ${user.phone}</div>
      <div class="user-actions">
        <button class="btn btn-edit" onclick="editUser(${user.id})">Sửa</button>
        <button class="btn btn-danger" onclick="confirmDelete(${user.id})">Xóa</button>
      </div>
    `;
    usersGrid.appendChild(userCard);
  });
}
//xử lý xóa người dùng
function confirmDelete(userId) {
  const confirmation = confirm(
    "Bạn có chắc chắn muốn xóa người dùng này không?"
  );
  if (confirmation) {
    // Xóa người dùng khỏi mảng users
    users = users.filter((user) => user.id !== userId);
    // Cập nhật localStorage
    localStorage.setItem("users", JSON.stringify(users));
    // Cập nhật giao diện
    renderUserList();
  }
}
//xử lý sửa người dùng
let editingUserId = null;
function editUser(userId) {
  const user = users.find((user) => user.id === userId);
  editingUserId = userId;
  if (user) {
    // Mở dialog và điền thông tin người dùng vào form
    userDialog.showModal();
    document.getElementById("dialog-title").textContent = "Sửa Người Dùng";
    nameInput.value = user.name;
    emailInput.value = user.email;
    phoneInput.value = user.phone;
  }
  //chỉnh sửa người dùng khi submit form
  userForm.onsubmit = (event) => {
    event.preventDefault();

    // Lấy thông tin đã sửa từ form
    const updatedUser = {
      id: user.id,
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
    };

    // Cập nhật thông tin người dùng trong mảng users
    users = users.map((user) => (user.id === userId ? updatedUser : user));

    // Cập nhật localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Cập nhật giao diện
    renderUserList();

    // Đóng dialog
    userDialog.close();
  };
}
