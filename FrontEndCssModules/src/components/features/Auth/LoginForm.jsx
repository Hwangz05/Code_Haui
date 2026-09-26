import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassNames from 'classnames/bind';

import { useAuth } from '../../../hooks/useAuth';
import { validateStudentId, validatePassword } from '../../../utils/validators';
import { ROUTES } from '../../../config/routes.config';
import Button from '../../common/Button/Button';
import styles from './LoginForm.module.css';

const cx = ClassNames.bind(styles);

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idError = validateStudentId(studentId);
        const pwdError = validatePassword(password);

        if (idError || pwdError) {
            setError(idError || pwdError);
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const res = await login(studentId, password);
            if (res?.user?.role === 'TEACHER') {
                navigate('/teacher/dashboard');
            } else {
                navigate(ROUTES.HOME);
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = (id, pwd) => {
        setStudentId(id);
        setPassword(pwd);
    };

    return (
        <div className={cx('card')}>
            <div className={cx('logoHeader')}>
                <div className={cx('logoOuter')}>
                    <div className={cx('logoInner')}>
                        <img
                            className={cx('logoImg')}
                            src="https://cdn-001.haui.edu.vn//img/logo-haui-size.png"
                            alt="Logo Đại học Công nghiệp Hà Nội"
                        />
                    </div>
                </div>
                <h1 className={cx('title')}>ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI</h1>
                <p className={cx('subtitle')}>One HaUI - Hệ thống Học & Đào tạo Lập trình CODE HAUI</p>
            </div>

            {error && <div className={cx('errorAlert')}>{error}</div>}

            <form onSubmit={handleSubmit} className={cx('form')}>
                <div>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Mã sinh viên hoặc Mã giảng viên (GV...)"
                        className={cx('inputField')}
                        required
                    />
                </div>

                <div className={cx('pwdWrapper')}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu"
                        className={cx('inputField')}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={cx('pwdToggle')}>
                        {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                </div>

                <div className={cx('linksRow')}>
                    <a
                        href="#forgot"
                        onClick={(e) => {
                            e.preventDefault();
                            alert('Vui lòng liên hệ Phòng Đào tạo HaUI để đặt lại mật khẩu!');
                        }}
                        className={cx('forgotLink')}
                    >
                        Quên mật khẩu ?
                    </a>
                    <a
                        href="#sso"
                        onClick={(e) => {
                            e.preventDefault();
                            alert('Chuyển hướng SSO HaUI Portal...');
                        }}
                        className={cx('ssoLink')}
                    >
                        Sử dụng tài khoản Đại học điện tử
                    </a>
                </div>

                <Button type="submit" variant="blue" size="lg" loading={isLoading} style={{ width: '100%' }}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
                </Button>
            </form>

            {/* Quick Demo Credentials */}
            {/* <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          👉 <strong>Chọn tài khoản mẫu để trải nghiệm:</strong>
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleQuickLogin('2021600123', 'haui@2026')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              background: 'rgba(249, 115, 22, 0.08)',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            🎓 Sinh viên<br /><small style={{ opacity: 0.8 }}>2021600123</small>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('GV2026', 'haui@2026')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#a78bfa',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            👨‍🏫 Giảng viên<br /><small style={{ opacity: 0.8 }}>GV2026</small>
          </button>
        </div>
      </div> */}

            <div className={cx('cardFooter')}>
                Copyright 2026 © <strong>HaUI</strong>
            </div>
        </div>
    );
}
