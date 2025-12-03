"use strict";
// app.ts - Đây là mã TypeScript cho logic client-side
// Sẽ được biên dịch thành dist/js/app.js
document.addEventListener("DOMContentLoaded", () => {
    // Lấy phần tử DOM
    const messageElement = document.getElementById("app-message");
    // Khởi tạo một đối tượng (Component logic)
    class Greeting {
        constructor(name) {
            this.name = name;
        }
        getMessage() {
            return `Xin chào ${this.name}! Component TypeScript đã khởi tạo thành công vào lúc ${new Date().toLocaleTimeString()}.`;
        }
    }
    // Sử dụng component logic
    const greeter = new Greeting("Người Dùng Tuyệt Vời");
    if (messageElement) {
        messageElement.innerHTML = greeter.getMessage();
        messageElement.classList.remove("bg-indigo-100");
        messageElement.classList.add("bg-green-100", "text-green-800");
    }
    // Lưu ý: Đối với dự án lớn, bạn cần quản lý việc import/export JS modules
    // Nếu không muốn bundling, bạn có thể sử dụng Namespace/IIFE hoặc cấu hình tsc/Gulp
    // để biên dịch từng file TS thành JS riêng biệt (dễ xảy ra xung đột global).
    // Giải pháp Gulp ở đây ưu tiên sự đơn giản và giữ cấu trúc file.
});
