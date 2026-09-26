export const validateStudentId = (id) => {
  if (!id || !id.trim()) {
    return 'Vui lòng nhập Mã sinh viên hoặc Mã giảng viên!';
  }
  if (id.trim().length < 4) {
    return 'Mã tài khoản phải có ít nhất 4 ký tự!';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return 'Vui lòng nhập Mật khẩu!';
  }
  if (password.length < 5) {
    return 'Mật khẩu phải có tối thiểu 5 ký tự!';
  }
  return null;
};
