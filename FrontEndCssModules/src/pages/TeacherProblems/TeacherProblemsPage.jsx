import React, { useState, useEffect, useCallback } from 'react';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faSearch,
    faFilter,
    faCode,
    faCheckCircle,
    faPenToSquare,
    faTrashCan,
    faEye,
    faBookBookmark,
    faLayerGroup,
    faClock,
    faMemory,
    faXmark,
    faFileCode,
    faSpinner,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {
    problemService,
    DIFFICULTY_VI,
    DIFFICULTY_BACKEND,
    DIFFICULTY_CONFIG,
    formatDate,
    mapProblemFromApi as mapProblem,
} from '../../services/problemService';
import styles from './TeacherProblemsPage.module.css';

const cx = ClassNames.bind(styles);

const FALLBACK_PROBLEMS = [
    {
        id: 1,
        title: 'Tìm số lớn nhất trong mảng',
        categoryName: 'Java Core',
        difficulty: 'Dễ',
        points: 100,
        timeLimitMs: 1000,
        memoryLimitMb: 256,
        totalSubmissions: 156,
        acceptanceRate: 88.4,
        createdAt: '2026-09-15T00:00:00',
        authorName: 'TS. Nguyễn Văn Hùng',
        slug: 'tim-so-lon-nhat',
        isPublished: true,
    },
    {
        id: 2,
        title: 'Quản lý Nhân viên kế thừa OOP',
        categoryName: 'Java OOP',
        difficulty: 'Trung bình',
        points: 150,
        timeLimitMs: 1500,
        memoryLimitMb: 256,
        totalSubmissions: 112,
        acceptanceRate: 72.1,
        createdAt: '2026-09-18T00:00:00',
        authorName: 'TS. Nguyễn Văn Hùng',
        slug: 'quan-ly-nhan-vien-oop',
        isPublished: true,
    },
    {
        id: 3,
        title: 'Cây nhị phân tìm kiếm BST',
        categoryName: 'Cấu trúc dữ liệu',
        difficulty: 'Khó',
        points: 200,
        timeLimitMs: 2000,
        memoryLimitMb: 512,
        totalSubmissions: 84,
        acceptanceRate: 45.8,
        createdAt: '2026-09-20T00:00:00',
        authorName: 'TS. Nguyễn Văn Hùng',
        slug: 'cay-nhi-phan-tim-kiem-bst',
        isPublished: true,
    },
    {
        id: 4,
        title: 'Tìm cặp số có tổng bằng K (Two Sum)',
        categoryName: 'Thuật toán',
        difficulty: 'Dễ',
        points: 100,
        timeLimitMs: 1000,
        memoryLimitMb: 256,
        totalSubmissions: 240,
        acceptanceRate: 92.5,
        createdAt: '2026-09-10T00:00:00',
        authorName: 'TS. Nguyễn Văn Hùng',
        slug: 'two-sum',
        isPublished: true,
    },
    {
        id: 5,
        title: 'Quy hoạch động: Bài toán cái túi (Knapsack)',
        categoryName: 'Thuật toán',
        difficulty: 'Khó',
        points: 250,
        timeLimitMs: 2000,
        memoryLimitMb: 512,
        totalSubmissions: 67,
        acceptanceRate: 38.2,
        createdAt: '2026-09-21T00:00:00',
        authorName: 'TS. Nguyễn Văn Hùng',
        slug: 'knapsack-dp',
        isPublished: true,
    },
];

export default function TeacherProblemsPage() {
    // ─── API state ───
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBackendOnline, setIsBackendOnline] = useState(true);

    // Pagination từ backend
    const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 1, currentPage: 1 });
    const PAGE_SIZE = 15;

    // ─── Filter state ───
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState(''); // input text, chỉ gửi khi Enter/nút
    const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);

    // ─── Modal state ───
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProblem, setNewProblem] = useState({
        title: '',
        category: 'Java Core',
        difficulty: 'Dễ',
        points: 100,
        timeLimit: '1.0s',
        memLimit: '256MB',
        statement: '',
        sampleInput: '',
        sampleOutput: '',
    });

    // ─── Fetch bài tập từ Backend ───
    const fetchProblems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: currentPage,
                size: PAGE_SIZE,
                isPublished: undefined, // lấy tất cả (cả unpublished) cho giảng viên
            };
            if (searchQuery) params.keyword = searchQuery;
            if (selectedDifficulty !== 'ALL') params.difficulty = DIFFICULTY_BACKEND[selectedDifficulty];

            const data = await problemService.getProblems(params);
            // data = PageResponse: { items[], totalPages, totalElements, currentPage }
            const items = (data.items || data.content || []).map(mapProblem);
            setProblems(items);
            setPagination({
                totalElements: data.totalElements || items.length,
                totalPages: data.totalPages || 1,
                currentPage: data.currentPage || currentPage,
            });
            setIsBackendOnline(true);
        } catch (err) {
            console.warn('[TeacherProblems] Backend offline, dùng dữ liệu mẫu:', err);
            setIsBackendOnline(false);
            setError('Không kết nối được Backend. Đang hiển thị dữ liệu mẫu.');
            setProblems(FALLBACK_PROBLEMS);
            setPagination({ totalElements: FALLBACK_PROBLEMS.length, totalPages: 1, currentPage: 1 });
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, selectedDifficulty]);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    // ─── Tạo bài tập mới (gọi API) ───
    const handleCreateProblem = async (e) => {
        e.preventDefault();
        if (!newProblem.title.trim() || !newProblem.statement.trim()) return;
        setIsSubmitting(true);

        const requestBody = {
            title: newProblem.title,
            categoryName: newProblem.category,
            difficulty: DIFFICULTY_BACKEND[newProblem.difficulty] || 'EASY',
            points: Number(newProblem.points) || 100,
            timeLimitMs: parseFloat(newProblem.timeLimit) * 1000 || 1000,
            memoryLimitMb: parseInt(newProblem.memLimit) || 256,
            statementMd: newProblem.statement,
            sampleInput: newProblem.sampleInput,
            sampleOutput: newProblem.sampleOutput,
        };

        try {
            if (isBackendOnline) {
                await problemService.createProblem(requestBody);
                alert(`✅ Đã tạo bài tập "${newProblem.title}" thành công!`);
                await fetchProblems(); // reload danh sách
            } else {
                // Fallback offline: thêm vào local state
                const localItem = mapProblem({
                    id: Date.now(),
                    ...requestBody,
                    totalSubmissions: 0,
                    acceptanceRate: 0,
                    createdAt: new Date().toISOString(),
                    authorName: 'TS. Nguyễn Văn Hùng',
                    slug: newProblem.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
                    isPublished: true,
                });
                setProblems((prev) => [localItem, ...prev]);
                alert(`✅ (Offline) Đã thêm bài tập "${newProblem.title}" vào danh sách tạm thời.`);
            }
        } catch (err) {
            alert(`❌ Lỗi khi tạo bài tập: ${err.message || 'Vui lòng thử lại.'}`);
        } finally {
            setIsSubmitting(false);
            setIsCreateModalOpen(false);
            setNewProblem({ title: '', category: 'Java Core', difficulty: 'Dễ', points: 100, timeLimit: '1.0s', memLimit: '256MB', statement: '', sampleInput: '', sampleOutput: '' });
        }
    };

    // ─── Xóa bài tập ───
    const handleDeleteProblem = async (id, title) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${title}"?`)) return;
        setProblems((prev) => prev.filter((p) => p.id !== id));
        // TODO: gọi DELETE /api/v1/problems/{id} khi backend có endpoint xóa
    };

    // ─── Filter client-side (chỉ dùng khi backend offline) ───
    const filteredProblems = isBackendOnline
        ? problems // backend đã filter server-side
        : problems.filter((p) => {
              const matchSearch =
                  !searchQuery ||
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
              const matchDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
              return matchSearch && matchDiff;
          });

    const totalSubmissions = problems.reduce((acc, p) => acc + (p.totalSubmissions || 0), 0);
    const avgAcRate =
        problems.length > 0
            ? (problems.reduce((acc, p) => acc + (p.acceptanceRate || 0), 0) / problems.length).toFixed(1)
            : '0.0';

    return (
        <div className={cx('page')}>
            <div className={cx('container')}>
                {/* 1. Header & Actions */}
                <div className={cx('pageHeader')}>
                    <div>
                        <h1 className={cx('pageTitle')}>
                            <FontAwesomeIcon icon={faFileCode} className={cx('pageTitleIcon')} />
                            Quản lý bài tập
                            {!isBackendOnline && (
                                <span style={{ marginLeft: 10, fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>
                                    Offline — Dữ liệu mẫu
                                </span>
                            )}
                        </h1>
                        <p className={cx('pageSubtitle')}>
                            Quản lý kho bài tập lập trình, cấu hình testcase và xuất bản bài tập cho sinh viên HaUI
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className={cx('createBtn')}
                            onClick={fetchProblems}
                            title="Tải lại dữ liệu từ server"
                            style={{ background: 'none', border: '1.5px solid #cbd5e1', color: '#64748b' }}
                        >
                            <FontAwesomeIcon icon={faRotateRight} spin={loading} />
                        </button>
                        <button className={cx('createBtn')} onClick={() => setIsCreateModalOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} />
                            Tạo bài tập mới
                        </button>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div style={{ marginBottom: 16, padding: '10px 16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 8, color: '#78350f', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* 2. Top Stats */}
                <div className={cx('statsGrid')}>
                    <div className={cx('statCard')}>
                        <div className={cx('statIconBox', 'iconBlue')}>
                            <FontAwesomeIcon icon={faBookBookmark} />
                        </div>
                        <div>
                            <span className={cx('statNumber')}>
                                {loading ? '…' : (pagination.totalElements || problems.length)}
                            </span>
                            <span className={cx('statLabel')}>Tổng bài tập đã tạo</span>
                        </div>
                    </div>

                    <div className={cx('statCard')}>
                        <div className={cx('statIconBox', 'iconOrange')}>
                            <FontAwesomeIcon icon={faCode} />
                        </div>
                        <div>
                            <span className={cx('statNumber')}>
                                {loading ? '…' : totalSubmissions.toLocaleString()}
                            </span>
                            <span className={cx('statLabel')}>Lượt sinh viên nộp bài</span>
                        </div>
                    </div>

                    <div className={cx('statCard')}>
                        <div className={cx('statIconBox', 'iconGreen')}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>
                            <span className={cx('statNumber')}>{loading ? '…' : `${avgAcRate}%`}</span>
                            <span className={cx('statLabel')}>Tỷ lệ AC trung bình</span>
                        </div>
                    </div>
                </div>

                {/* 3. Filter Bar */}
                <div className={cx('filterCard')}>
                    <div className={cx('searchBox')}>
                        <FontAwesomeIcon icon={faSearch} className={cx('searchIcon')} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên bài tập... (Enter để tìm)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchQuery(searchInput);
                                    setCurrentPage(1);
                                }
                            }}
                            className={cx('searchInput')}
                        />
                        {searchInput && (
                            <button
                                onClick={() => { setSearchInput(''); setSearchQuery(''); setCurrentPage(1); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0 8px' }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        )}
                    </div>

                    <div className={cx('filterSelects')}>
                        <div className={cx('selectWrap')}>
                            <FontAwesomeIcon icon={faFilter} className={cx('selectIcon')} />
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
                                className={cx('selectInput')}
                            >
                                <option value="ALL">Tất cả độ khó</option>
                                <option value="Dễ">Dễ (Easy)</option>
                                <option value="Trung bình">Trung bình (Medium)</option>
                                <option value="Khó">Khó (Hard)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. Problems Table */}
                <div className={cx('tableCard')}>
                    <div className={cx('tableHeader')}>
                        <h3 className={cx('tableTitle')}>
                            Danh sách bài tập ({loading ? '...' : (isBackendOnline ? pagination.totalElements : filteredProblems.length)})
                            {isBackendOnline && pagination.totalPages > 1 && (
                                <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#94a3b8', marginLeft: 8 }}>
                                    — Trang {currentPage}/{pagination.totalPages}
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className={cx('tableScroll')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th style={{ width: '60px', textAlign: 'center' }}>Mã</th>
                                    <th>Tên bài tập</th>
                                    <th>Chủ đề</th>
                                    <th>Độ khó</th>
                                    <th style={{ textAlign: 'center' }}>Điểm</th>
                                    <th style={{ textAlign: 'center' }}>Lượt nộp</th>
                                    <th style={{ textAlign: 'center' }}>Tỷ lệ AC</th>
                                    <th style={{ textAlign: 'center' }}>Ngày tạo</th>
                                    <th style={{ textAlign: 'center', width: '140px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                                            <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '1.4rem', marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                                            Đang tải dữ liệu từ server...
                                        </td>
                                    </tr>
                                ) : filteredProblems.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className={cx('emptyState')}>
                                            Không tìm thấy bài tập nào phù hợp với bộ lọc.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProblems.map((p) => {
                                        const diff = DIFFICULTY_CONFIG[p.difficulty] || DIFFICULTY_CONFIG['Dễ'];
                                        return (
                                            <tr key={p.id} className={cx('tableRow')}>
                                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#94a3b8' }}>
                                                    #{p.id}
                                                </td>
                                                <td>
                                                    <div className={cx('problemTitleWrap')}>
                                                        <strong className={cx('problemTitle')}>{p.title}</strong>
                                                        <div className={cx('problemLimits')}>
                                                            <span><FontAwesomeIcon icon={faClock} /> {(p.timeLimitMs / 1000).toFixed(1)}s</span>
                                                            <span><FontAwesomeIcon icon={faMemory} /> {p.memoryLimitMb}MB</span>
                                                            {!p.isPublished && (
                                                                <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚫ Nháp</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={cx('categoryBadge')}>{p.categoryName}</span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={cx('difficultyBadge')}
                                                        style={{
                                                            color: diff.color,
                                                            backgroundColor: diff.bg,
                                                            borderColor: diff.border,
                                                        }}
                                                    >
                                                        {p.difficulty}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#ea580c' }}>
                                                    {p.points}
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                                                    {(p.totalSubmissions || 0).toLocaleString()}
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
                                                    {p.acceptanceRate != null ? `${p.acceptanceRate}%` : '—'}
                                                </td>
                                                <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                                                    {formatDate(p.createdAt)}
                                                </td>
                                                <td>
                                                    <div className={cx('actionsGroup')}>
                                                        <Link
                                                            to={`/thi-dau/${p.slug}`}
                                                            className={cx('actionBtn', 'actionView')}
                                                            title="Xem trước giao diện làm bài"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>
                                                        <button
                                                            className={cx('actionBtn', 'actionEdit')}
                                                            onClick={() => alert(`Chỉnh sửa bài tập: ${p.title}`)}
                                                            title="Chỉnh sửa đề bài & testcase"
                                                        >
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </button>
                                                        <button
                                                            className={cx('actionBtn', 'actionDelete')}
                                                            onClick={() => handleDeleteProblem(p.id, p.title)}
                                                            title="Xóa bài tập"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination (chỉ hiện khi backend online và có nhiều trang) */}
                    {isBackendOnline && pagination.totalPages > 1 && !loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 0', borderTop: '1px solid #f1f5f9' }}>
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: currentPage <= 1 ? '#f8fafc' : '#fff', color: currentPage <= 1 ? '#cbd5e1' : '#334155', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
                            >
                                ← Trước
                            </button>
                            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid', borderColor: currentPage === page ? '#f97316' : '#e2e8f0', background: currentPage === page ? '#fff7ed' : '#fff', color: currentPage === page ? '#ea580c' : '#334155', fontWeight: currentPage === page ? 700 : 400, cursor: 'pointer' }}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={currentPage >= pagination.totalPages}
                                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: currentPage >= pagination.totalPages ? '#f8fafc' : '#fff', color: currentPage >= pagination.totalPages ? '#cbd5e1' : '#334155', cursor: currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                Sau →
                            </button>
                        </div>
                    )}
                </div>

                {/* 5. Modal Tạo bài tập mới */}
                {isCreateModalOpen && (
                    <div className={cx('modalOverlay')}>
                        <div className={cx('modalBox')}>
                            <div className={cx('modalHeader')}>
                                <div className={cx('modalHeaderLeft')}>
                                    <FontAwesomeIcon icon={faPlus} className={cx('modalIcon')} />
                                    <h2>Tạo bài tập lập trình mới</h2>
                                </div>
                                <button className={cx('modalCloseBtn')} onClick={() => setIsCreateModalOpen(false)}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProblem} className={cx('modalForm')}>
                                <div className={cx('formGroup')}>
                                    <label className={cx('formLabel')}>Tiêu đề bài tập <span className={cx('req')}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Tính tổng các số nguyên chẵn trong mảng"
                                        value={newProblem.title}
                                        onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                                        className={cx('formInput')}
                                        required
                                    />
                                </div>

                                <div className={cx('formRow')}>
                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Chủ đề môn học</label>
                                        <select
                                            value={newProblem.category}
                                            onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                                            className={cx('formSelect')}
                                        >
                                            <option value="Java Core">Java Core</option>
                                            <option value="Java OOP">Java OOP</option>
                                            <option value="Cấu trúc dữ liệu">Cấu trúc dữ liệu</option>
                                            <option value="Thuật toán">Thuật toán</option>
                                            <option value="Lập trình C/C++">Lập trình C/C++</option>
                                            <option value="Lập trình Web">Lập trình Web</option>
                                        </select>
                                    </div>

                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Độ khó</label>
                                        <select
                                            value={newProblem.difficulty}
                                            onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                                            className={cx('formSelect')}
                                        >
                                            <option value="Dễ">Dễ (Easy)</option>
                                            <option value="Trung bình">Trung bình (Medium)</option>
                                            <option value="Khó">Khó (Hard)</option>
                                        </select>
                                    </div>

                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Điểm rèn luyện</label>
                                        <input
                                            type="number"
                                            value={newProblem.points}
                                            onChange={(e) => setNewProblem({ ...newProblem, points: e.target.value })}
                                            className={cx('formInput')}
                                        />
                                    </div>
                                </div>

                                <div className={cx('formRow')}>
                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Giới hạn thời gian (Time Limit)</label>
                                        <input
                                            type="text"
                                            value={newProblem.timeLimit}
                                            onChange={(e) => setNewProblem({ ...newProblem, timeLimit: e.target.value })}
                                            className={cx('formInput')}
                                        />
                                    </div>

                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Giới hạn bộ nhớ (Memory Limit)</label>
                                        <input
                                            type="text"
                                            value={newProblem.memLimit}
                                            onChange={(e) => setNewProblem({ ...newProblem, memLimit: e.target.value })}
                                            className={cx('formInput')}
                                        />
                                    </div>
                                </div>

                                <div className={cx('formGroup')}>
                                    <label className={cx('formLabel')}>Nội dung đề bài (Hỗ trợ Markdown) <span className={cx('req')}>*</span></label>
                                    <textarea
                                        rows="4"
                                        placeholder="Mô tả chi tiết bài toán, định dạng dữ liệu đầu vào (Input) và đầu ra (Output)..."
                                        value={newProblem.statement}
                                        onChange={(e) => setNewProblem({ ...newProblem, statement: e.target.value })}
                                        className={cx('formTextarea')}
                                        required
                                    />
                                </div>

                                <div className={cx('formRow')}>
                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Testcase Mẫu Input</label>
                                        <textarea
                                            rows="3"
                                            placeholder="5&#10;1 2 3 4 5"
                                            value={newProblem.sampleInput}
                                            onChange={(e) => setNewProblem({ ...newProblem, sampleInput: e.target.value })}
                                            className={cx('formTextareaCode')}
                                        />
                                    </div>

                                    <div className={cx('formGroup')}>
                                        <label className={cx('formLabel')}>Testcase Mẫu Output</label>
                                        <textarea
                                            rows="3"
                                            placeholder="6"
                                            value={newProblem.sampleOutput}
                                            onChange={(e) => setNewProblem({ ...newProblem, sampleOutput: e.target.value })}
                                            className={cx('formTextareaCode')}
                                        />
                                    </div>
                                </div>

                                <div className={cx('modalFooter')}>
                                    <button
                                        type="button"
                                        className={cx('cancelBtn')}
                                        onClick={() => setIsCreateModalOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button type="submit" className={cx('submitBtn')} disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <><FontAwesomeIcon icon={faSpinner} spin /> Đang tạo...</>
                                        ) : (
                                            '🚀 Xuất bản bài tập cho sinh viên'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
