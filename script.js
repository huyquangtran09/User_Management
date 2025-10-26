// tạo cờ
let isEditing = null;
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
const searchInput = document.getElementById("search-input");
const userNotFound = document.getElementById("user-notFound");

// Thêm sự kiện click cho nút "Thêm Người Dùng Mới"
addUserBtn.addEventListener("click", () => {
  userDialog.showModal();
});

//Tạo mảng dữ liệu người dùng
let users = [];
let filteredUsers = [];

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

  //nếu editingUserId là true thì cập nhật người dùng
  //nếu không thì thêm người dùng mới
  if (editingUserId) {
    //sửa user không dùng index mà dùng id
    const user = users.find((user) => user.id === editingUserId);
    if (user) {
      user.name = name;
      user.email = email;
      user.phone = phone;
    }
    isEditing = null; //đặt lại cờ sau khi sửa xong
  }
  if (!editingUserId) {
    //thêm mới user
    const newUser = {
      id: Date.now(), //sử dụng timestamp làm id duy nhất
      name: name,
      email: email,
      phone: phone,
    };
    users.push(newUser);
  }

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

  //Lọc người dùng theo từ khóa tìm kiếm
  const query = searchInput.value.toLowerCase();
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  //nếu users rỗng, hiển thị trạng thái trống
  if (users.length === 0) {
    if (filteredUsers.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
  } else {
    if (filteredUsers.length === 0) {
      userNotFound.style.display = "block";
      userNotFound.textContent = `Không có người dùng nào với từ khóa "${query}".`;
    } else {
      userNotFound.style.display = "none";
      emptyState.style.display = "none";
    }
  }

  // nếu query rông=> filteredUsers = users
  if (query === "") {
    filteredUsers = users;
  }
  //if user array is empty, show empty state

  // Hiển thị danh sách người dùng
  filteredUsers.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.innerHTML = `
      <div class="user-name">${user.name}</div>
      <div class="user-detail"><strong>Email:</strong> ${user.email}</div>
      <div class="user-detail"><strong>Điện thoại:</strong> ${user.phone}</div>
      <div class="user-actions">
        <button class="btn btn-edit" onclick="editUser(${user.id})">Edit</button>
        <button class="btn btn-danger" onclick="confirmDelete(${user.id})">Delete</button>
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

    //if (editingUserId !== null) {
  };
}

// lắng nghe sự kiện input trên ô tìm kiếm
searchInput.addEventListener("input", () => {
  renderUserList();
});
