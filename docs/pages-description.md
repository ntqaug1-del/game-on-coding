# Mô tả các trang trong dự án

## 1. Trang My Resume (`src/pages/Resume.tsx`)

### Tổng quan
Trang My Resume là một trang portfolio cá nhân hiện đại, được thiết kế để trưng bày thông tin cá nhân, kinh nghiệm làm việc, dự án và sở thích của người dùng. Trang sử dụng React và Tailwind CSS để tạo giao diện người dùng hấp dẫn và responsive.

### Cấu trúc trang
Trang được chia thành các phần chính sau:

#### 1. Hero Section
- **Vị trí**: Phần đầu tiên của trang
- **Nội dung**: Hiển thị tên, chức danh nghề nghiệp, và mô tả ngắn
- **Tính năng**: Hình nền đẹp mắt, hiệu ứng animation cho văn bản, liên kết mạng xã hội
- **Thiết kế**: Sử dụng gradient và hiệu ứng shadow để tạo chiều sâu

#### 2. About Section
- **Vị trí**: Phần thứ hai của trang
- **Nội dung**: Thông tin cá nhân, tóm tắt chuyên môn
- **Component**: Sử dụng component `About` từ `../components/resume/about/About`
- **Thiết kế**: Nền trắng với các thẻ thông tin được phân chia rõ ràng

#### 3. Resume Section
- **Vị trí**: Phần thứ ba của trang
- **Nội dung**: Sơ yếu lý lịch, học vấn, kinh nghiệm làm việc
- **Component**: Sử dụng component `ResumeSection` từ `../components/resume/resumesection/ResumeSection`
- **Thiết kế**: Nền xám nhạt với timeline hiển thị quá trình học tập và làm việc

#### 4. Portfolio Section
- **Vị trí**: Phần thứ tư của trang
- **Nội dung**: Trưng bày các dự án đã thực hiện
- **Component**: Sử dụng component `Portfolio` từ `../components/resume/portfolio/Portfolio`
- **Tính năng**: Hiển thị dự án dưới dạng grid, có thể lọc theo nền tảng
- **Thiết kế**: Nền trắng với các card dự án có hiệu ứng hover

#### 5. Life Outside Programming Section
- **Vị trí**: Phần thứ năm của trang
- **Nội dung**: Hiển thị sở thích và hoạt động ngoài lập trình
- **Component**: Sử dụng component `LifeOutsideProgramming` từ `../components/resume/life/LifeOutsideProgramming`
- **Tính năng**: Tabs cho các sở thích khác nhau (bóng đá, du lịch, gaming)
- **Thiết kế**: Nền xám nhạt với các card và slider hiển thị hình ảnh

#### 6. Contact Section
- **Vị trí**: Phần thứ sáu của trang
- **Nội dung**: Thông tin liên hệ và form gửi tin nhắn
- **Tính năng**: Form liên hệ với các trường thông tin cơ bản
- **Thiết kế**: Nền trắng, chia làm hai cột cho thông tin liên hệ và form

#### 7. Footer
- **Vị trí**: Cuối trang
- **Nội dung**: Tên, mô tả ngắn, liên kết mạng xã hội, thông tin bản quyền
- **Thiết kế**: Nền xám nhạt, thiết kế đơn giản và thanh lịch

### Điều hướng
- **Side Navigation**: Thanh điều hướng cố định bên trái với các biểu tượng cho từng phần
- **Mobile Menu**: Nút hamburger hiển thị menu trên thiết bị di động
- **Back to Top**: Nút quay lại đầu trang xuất hiện khi cuộn xuống
- **Smooth Scrolling**: Cuộn mượt mà giữa các phần khi nhấp vào menu

### Công nghệ sử dụng
- **Framework**: React
- **Styling**: Tailwind CSS
- **Icons**: React Icons (FaHome, FaUser, v.v.)
- **Animations**: CSS Animations và React transitions
- **Carousel**: Slick Carousel cho phần slider
- **Responsive Design**: Sử dụng Tailwind breakpoints

### Tính năng đặc biệt
- **Responsive Design**: Tương thích với nhiều kích thước màn hình
- **Animations**: Hiệu ứng fade-in và slide-up cho các phần tử
- **Active Section Tracking**: Tự động cập nhật menu active dựa trên vị trí cuộn
- **Interactive Elements**: Các phần tử tương tác với hiệu ứng hover và focus

## 2. Các Component Chính

### About Component
- **Đường dẫn**: `../components/resume/about/About`
- **Chức năng**: Hiển thị thông tin cá nhân và tóm tắt chuyên môn
- **Nội dung**: Thông tin cá nhân, kỹ năng, và tóm tắt chuyên môn

### ResumeSection Component
- **Đường dẫn**: `../components/resume/resumesection/ResumeSection`
- **Chức năng**: Hiển thị sơ yếu lý lịch với timeline
- **Nội dung**: Học vấn, kinh nghiệm làm việc, và thông tin liên hệ

### Portfolio Component
- **Đường dẫn**: `../components/resume/portfolio/Portfolio`
- **Chức năng**: Hiển thị các dự án đã thực hiện
- **Tính năng**: Lọc dự án theo nền tảng, hiệu ứng hover cho card dự án

### LifeOutsideProgramming Component
- **Đường dẫn**: `../components/resume/life/LifeOutsideProgramming`
- **Chức năng**: Hiển thị sở thích và hoạt động ngoài lập trình
- **Tính năng**: Tabs cho các sở thích khác nhau, slider hình ảnh, modal xem hình ảnh lớn
