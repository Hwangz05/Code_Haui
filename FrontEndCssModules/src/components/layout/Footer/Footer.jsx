import React from 'react';
import ClassNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

import { ROUTES } from '../../../config/routes.config';
import styles from './Footer.module.css';

const cx = ClassNames.bind(styles);

export default function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('container')}>
                <div className={cx('grid')}>
                    {/* Brand Col */}
                    <div className={cx('brandCol')}>
                        <div className={cx('brand')}>
                            <div className={cx('logoBox')}>
                                <div className={cx('logoInner')}>
                                    <img
                                        className={cx('logoImg')}
                                        src="https://cdn-001.haui.edu.vn//img/logo-haui-size.png"
                                        alt="Logo Đại học Công nghiệp Hà Nội"
                                    />
                                </div>
                            </div>
                            <div className={cx('brandText')}>
                                <div className={cx('brandTitle')}>CODE HAUI</div>
                                <div className={cx('brandSubtitle')}>Đại học Công nghiệp Hà Nội</div>
                            </div>
                        </div>

                        <p className={cx('desc')}>
                            Nền tảng học tập, luyện code và thi đấu lập trình trực tuyến dành riêng cho sinh viên Đại
                            học Công nghiệp Hà Nội.
                        </p>

                        <div className={cx('contactInfo')}>
                            <p>
                                <FontAwesomeIcon icon={faLocationDot} className={cx('icon-footer')} />
                                Số 298 đường Cầu Diễn, quận Bắc Từ Liêm, Hà Nội
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faEnvelope} className={cx('icon-footer')} />
                                dhcnhn@haui.edu.vn | codehaui@haui.edu.vn
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faPhone} className={cx('icon-footer')} />
                                (024) 3765 5121 - Khoa CNTT HaUI
                            </p>
                        </div>
                    </div>

                    {/* Courses Col */}
                    <div>
                        <h4 className={cx('colTitle')}>Khóa học</h4>
                        <ul className={cx('linkList')}>
                            <li>
                                <Link to={ROUTES.KHOA_HOC}>Lập trình Java Căn bản & OOP</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.KHOA_HOC}>Cấu trúc dữ liệu & Giải thuật</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.KHOA_HOC}>Lập trình Web với ReactJS</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.KHOA_HOC}>Backend Java Spring Boot 3</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.KHOA_HOC}>Lập trình C / C++ Nhập môn</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.KHOA_HOC}>Cơ sở dữ liệu & SQL chuẩn</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contest Col */}
                    <div>
                        <h4 className={cx('colTitle')}>Trang thi đấu</h4>
                        <ul className={cx('linkList')}>
                            <li>
                                <Link to={ROUTES.THI_DAU}>Tất cả bài thi đấu</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.THI_DAU}>Thử thách thuật toán</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.THI_DAU}>Bài tập rèn luyện mỗi ngày</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.LEADERBOARD}>Bảng xếp hạng sinh viên</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.THI_DAU}>Kỳ thi HaUI Code Challenge</Link>
                            </li>
                            <li>
                                <Link to={ROUTES.PROFILE}>Lịch sử chấm bài</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Terms Col (Renamed as requested) */}
                    <div>
                        <h4 className={`${cx('colTitle')} ${cx('highlightTitle')}`}>Điều khoản sử dụng</h4>
                        <ul className={cx('linkList')}>
                            <li>
                                <a href="#terms" onClick={(e) => e.preventDefault()}>
                                    Điều khoản dịch vụ CODE HAUI
                                </a>
                            </li>
                            <li>
                                <a href="#privacy" onClick={(e) => e.preventDefault()}>
                                    Chính sách bảo mật thông tin
                                </a>
                            </li>
                            <li>
                                <a href="#rules" onClick={(e) => e.preventDefault()}>
                                    Quy chế thi đấu & Chống gian lận
                                </a>
                            </li>
                            <li>
                                <a href="#guide" onClick={(e) => e.preventDefault()}>
                                    Hướng dẫn chấm bài tự động
                                </a>
                            </li>
                            <li>
                                <a href="#faq" onClick={(e) => e.preventDefault()}>
                                    Câu hỏi thường gặp (FAQ)
                                </a>
                            </li>
                            <li>
                                <a href="#support" onClick={(e) => e.preventDefault()}>
                                    Liên hệ hỗ trợ kỹ thuật
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className={cx('bottomBar')}>
                    <p>
                        © 2026 <strong>CODE HAUI</strong> - Bản quyền thuộc Trường Đại học Công nghiệp Hà Nội.
                    </p>
                    <p>Phiên bản CSS Modules Clean Architecture</p>
                </div>
            </div>
        </footer>
    );
}
