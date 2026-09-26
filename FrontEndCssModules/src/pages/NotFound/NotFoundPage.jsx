import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import Button from '../../components/common/Button/Button';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--color-primary)' }}>404</div>
      <h1 style={{ color: '#fff' }}>Không tìm thấy trang</h1>
      <Link to={ROUTES.HOME}>
        <Button variant="primary" size="md">Quay lại Trang chủ</Button>
      </Link>
    </div>
  );
}
