import React, { useState, useEffect } from 'react';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBookOpenReader } from '@fortawesome/free-solid-svg-icons';

import Badge from '../../components/common/Badge/Badge';
import CourseCard from '../../components/features/Courses/CourseCard';
import styles from './KhoaHocPage.module.css';
import { courseService, mapCourseFromApi } from '../../services/courseService';

const cx = ClassNames.bind(styles);

export default function KhoaHocPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const categories = [
        { id: 'All', label: 'Tất cả chủ đề' },
        { id: 'Java', label: 'Java & Spring Boot' },
        { id: 'Algorithms', label: 'Cấu trúc & Giải thuật' },
        { id: 'Web', label: 'Lập trình Web' },
        { id: 'C++', label: 'C / C++ Cơ sở' },
        { id: 'Database', label: 'Cơ sở Dữ liệu & SQL' },
    ];

    useEffect(() => {
        let isMounted = true;
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const data = await courseService.getAllCourses();
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    setCourses(data.map(mapCourseFromApi));
                }
            } catch (err) {
                console.warn('Lấy course từ backend thất bại:', err);
                if (isMounted) {
                    // Fallback về danh sách mặc định khi backend lỗi
                    setCourses((prev) => (prev.length > 0 ? prev : []));
                }
            } finally {
                if (isMounted) setLoadingCourses(false);
            }
        };

        fetchCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredCourses = courses.filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
            (c.title || '').toLowerCase().includes(q) ||
            (c.desc || '').toLowerCase().includes(q) ||
            (c.instructor || '').toLowerCase().includes(q);
        const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
        const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
        return matchSearch && matchCat && matchLevel;
    });

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            {/* Banner */}
            <div className={cx('banner')}>
                <div className={cx('bannerContent')}>
                    <Badge variant="orange">
                        <FontAwesomeIcon icon={faBookOpenReader} className={cx('faBookOpenReader-icon')} />
                        <span className={cx('bannerText-Label')}>CHƯƠNG TRÌNH ĐÀO TẠO KHOA CNTT HAUI</span>
                    </Badge>
                    <h1 className={cx('title')}>Khóa Học Lập Trình Chuẩn Quốc Tế</h1>
                    <p className={cx('desc')}>
                        Được giảng viên và sinh viên ưu tú HaUI biên soạn. Kết hợp lý thuyết thực chiến với hệ thống chấm
                        bài tự động theo thời gian thực.
                    </p>
                </div>
                <div className={cx('bannerStats')}>
                    <div className={cx('bannerStatItem')}>
                        <span className={cx('bannerStatNum')}>8+</span>
                        <span className={cx('bannerStatLabel')}>Khóa học</span>
                    </div>
                    <div className={cx('bannerStatItem')}>
                        <span className={cx('bannerStatNum')}>13K+</span>
                        <span className={cx('bannerStatLabel')}>Lượt sinh viên</span>
                    </div>
                    <div className={cx('bannerStatItem')}>
                        <span className={cx('bannerStatNum')}>100%</span>
                        <span className={cx('bannerStatLabel')}>Miễn phí</span>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className={cx('categoryPills')}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${cx('pillBtn')} ${selectedCategory === cat.id ? cx('pillBtnActive') : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Search & Level Filter Row */}
            <div className={cx('filterRow')}>
                <div className={cx('searchBox')}>
                    <span className={cx('searchIcon')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="fasearch-icon" />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo tên khóa học, giảng viên, nội dung..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cx('searchInput')}
                    />
                </div>

                <div className={cx('levelFilter')}>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className={cx('levelSelect')}
                    >
                        <option value="All">Tất cả trình độ</option>
                        <option value="Cơ bản">Cơ bản (Năm 1 - 2)</option>
                        <option value="Trung cấp">Trung cấp (Năm 2 - 3)</option>
                        <option value="Nâng cao">Nâng cao (Chuyên ngành)</option>
                    </select>
                </div>
            </div>

            {/* Results summary */}
            <div className={cx('summaryRow')}>
                <span className={cx('countText')}>
                    Tìm thấy <strong>{filteredCourses.length}</strong> khóa học
                </span>
            </div>

            {/* Course Cards Grid */}
            <div className={cx('grid')}>
                {filteredCourses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                ))}
            </div>
        </div>
    );
}
