import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faClock, faStar, faBookOpen } from '@fortawesome/free-solid-svg-icons';

import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import styles from './CourseCard.module.css';

const cx = ClassNames.bind(styles);

export default function CourseCard({ course }) {
    const navigate = useNavigate();

    const handleGoToCourse = () => {
        navigate(`/khoa-hoc/${course.slug || course.id}`);
    };

    return (
        <div className={cx('card')} onClick={handleGoToCourse} style={{ cursor: 'pointer' }}>
            <div className={cx('imageWrapper')}>
                <img src={course.image} alt={course.title} className={cx('image')} />
                <span className={cx('levelTag')}>{course.level}</span>
                <span className={cx('freeTag')}>Miễn phí HaUI</span>
            </div>

            <div className={cx('body')}>
                <div>
                    <Badge variant="orange">{course.category}</Badge>
                    <h3 className={cx('title')}>{course.title}</h3>
                    <p className={cx('desc')}>{course.desc}</p>
                    <p className={cx('instructor')}>
                        <FontAwesomeIcon icon={faUserGraduate} className={cx('icon-user')} />
                        Giảng viên: <strong style={{ color: '#fff' }}>{course.instructor}</strong>
                    </p>
                </div>

                {course.isEnrolled && (
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <span>Tiến độ học:</span>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{course.progress}%</span>
                        </div>
                        <div className={cx('progressBar')}>
                            <div className={cx('progressFill')} style={{ width: `${course.progress}%` }} />
                        </div>
                    </div>
                )}

                <div className={cx('meta')}>
                    <span>
                        <FontAwesomeIcon icon={faClock} className={cx('icon-clock')} />
                        {course.duration || '35 giờ'}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faBookOpen} className={cx('icon-book')} />
                        {course.lessons} bài
                    </span>
                    <span style={{ color: '#facc15', fontWeight: 700 }}>
                        <FontAwesomeIcon icon={faStar} className={cx('icon-star')} />
                        {course.rating}
                    </span>
                </div>

                <Button
                    variant={course.isEnrolled ? 'primary' : 'secondary'}
                    size="sm"
                    style={{ width: '100%' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleGoToCourse();
                    }}
                >
                    {course.isEnrolled ? (course.progress === 100 ? 'Học lại' : 'Tiếp tục học →') : 'Vào học ngay →'}
                </Button>
            </div>
        </div>
    );
}