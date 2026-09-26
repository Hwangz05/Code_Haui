import React, { useState } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styles from './TeacherProblemsPage.module.css';

const cx = ClassNames.bind(styles);

const INITIAL_PROBLEMS = [
    {
        id: 1,
        title: 'Tìm số lớn nhất trong mảng',
        category: 'Java Core',
        difficulty: 'Dễ',
        points: 100,
        timeLimit: '1.0s',
        memLimit: '256MB',
        submissions: 156,
        acRate: '88.4%',
        createdDate: '15/09/2026',
        author: 'TS. Nguyễn Văn Hùng',
        slug: 'tim-so-lon-nhat',
    },
    {
        id: 2,
        title: 'Quản lý Nhân viên kế thừa OOP',
        category: 'Java OOP',
        difficulty: 'Trung bình',
        points: 150,
        timeLimit: '1.5s',
        memLimit: '256MB',
        submissions: 112,
        acRate: '72.1%',
        createdDate: '18/09/2026',
        author: 'TS. Nguyễn Văn Hùng',
        slug: 'quan-ly-nhan-vien-oop',
    },
    {
        id: 3,
        title: 'Cây nhị phân tìm kiếm BST',
        category: 'Cấu trúc dữ liệu',
        difficulty: 'Khó',
        points: 200,
        timeLimit: '2.0s',
        memLimit: '512MB',
        submissions: 84,
        acRate: '45.8%',
        createdDate: '20/09/2026',
        author: 'TS. Nguyễn Văn Hùng',
        slug: 'cay-nhi-phan-tim-kiem-bst',
    },
    {
        id: 4,
        title: 'Tìm cặp số có tổng bằng K (Two Sum)',
        category: 'Thuật toán',
        difficulty: 'Dễ',
        points: 100,
        timeLimit: '1.0s',
        memLimit: '256MB',
        submissions: 240,
        acRate: '92.5%',
        createdDate: '10/09/2026',
        author: 'TS. Nguyễn Văn Hùng',
        slug: 'two-sum',
    },
    {
        id: 5,
        title: 'Quy hoạch động: Bài toán cái túi (Knapsack)',
        category: 'Thuật toán',
        difficulty: 'Khó',
        points: 250,
        timeLimit: '2.0s',
        memLimit: '512MB',
        submissions: 67,
        acRate: '38.2%',
        createdDate: '21/09/2026',
        author: 'TS. Nguyễn Văn Hùng',
        slug: 'knapsack-dp',
    },
];

const DIFFICULTY_CONFIG = {
    'Dễ': { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    'Trung bình': { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    'Khó': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

export default function TeacherProblemsPage() {
    const [problems, setProblems] = useState(INITIAL_PROBLEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form state
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

    const handleCreateProblem = (e) => {
        e.preventDefault();
        if (!newProblem.title.trim()) return;

        const created = {
            id: problems.length + 1,
            title: newProblem.title,
            category: newProblem.category,
            difficulty: newProblem.difficulty,
            points: Number(newProblem.points) || 100,
            timeLimit: newProblem.timeLimit,
            memLimit: newProblem.memLimit,
            submissions: 0,
            acRate: '100%',
            createdDate: 'Hôm nay',
            author: 'TS. Nguyễn Văn Hùng',
            slug: newProblem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        };

        setProblems([created, ...problems]);
        setIsCreateModalOpen(false);
        setNewProblem({
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
        alert(`✅ Đã thêm thành công bài tập: "${created.title}" vào kho bài tập HaUI!`);
    };

    const handleDeleteProblem = (id, title) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bài tập "${title}"?`)) {
            setProblems(problems.filter((p) => p.id !== id));
        }
    };

    const filteredProblems = problems.filter((p) => {
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchDiff = selectedDifficulty === 'ALL' || p.difficulty === selectedDifficulty;
        return matchSearch && matchCat && matchDiff;
    });

    const categories = ['ALL', 'Java Core', 'Java OOP', 'Cấu trúc dữ liệu', 'Thuật toán'];

    return (
        <div className={cx('page')}>
            <div className={cx('container')}>
                {/* 1. Header & Actions */}
                <div className={cx('pageHeader')}>
                    <div>
                        <h1 className={cx('pageTitle')}>
                            <FontAwesomeIcon icon={faFileCode} className={cx('pageTitleIcon')} />
                            Quản lý bài tập
                        </h1>
                        <p className={cx('pageSubtitle')}>
                            Quản lý kho bài tập lập trình, cấu hình testcase và xuất bản bài tập cho sinh viên HaUI
                        </p>
                    </div>

                    <button className={cx('createBtn')} onClick={() => setIsCreateModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                        Tạo bài tập mới
                    </button>
                </div>

                {/* 2. Top Stats */}
                <div className={cx('statsGrid')}>
                    <div className={cx('statCard')}>
                        <div className={cx('statIconBox', 'iconBlue')}>
                            <FontAwesomeIcon icon={faBookBookmark} />
                        </div>
                        <div>
                            <span className={cx('statNumber')}>{problems.length}</span>
                            <span className={cx('statLabel')}>Tổng bài tập đã tạo</span>
                        </div>
                    </div>

                    <div className={cx('statCard')}>
                        <div className={cx('statIconBox', 'iconOrange')}>
                            <FontAwesomeIcon icon={faCode} />
                        </div>
                        <div>
                            <span className={cx('statNumber')}>
                                {problems.reduce((acc, p) => acc + p.submissions, 0)}
                            </span>
                            <span className={cx('statLabel')}>Lượt sinh viên nộp bài</span>
                        </div>
                    </div>

                    <div className={cx('statCard')}>
                        <div className={cx('statIconBox', 'iconGreen')}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>
                            <span className={cx('statNumber')}>78.5%</span>
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
                            placeholder="Tìm kiếm theo tên bài tập, chủ đề..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cx('searchInput')}
                        />
                    </div>

                    <div className={cx('filterSelects')}>
                        <div className={cx('selectWrap')}>
                            <FontAwesomeIcon icon={faLayerGroup} className={cx('selectIcon')} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={cx('selectInput')}
                            >
                                <option value="ALL">Tất cả chủ đề</option>
                                <option value="Java Core">Java Core</option>
                                <option value="Java OOP">Java OOP</option>
                                <option value="Cấu trúc dữ liệu">Cấu trúc dữ liệu</option>
                                <option value="Thuật toán">Thuật toán</option>
                            </select>
                        </div>

                        <div className={cx('selectWrap')}>
                            <FontAwesomeIcon icon={faFilter} className={cx('selectIcon')} />
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className={cx('selectInput')}
                            >
                                <option value="ALL">Tất cả độ khó</option>
                                <option value="Dễ">Dễ</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Khó">Khó</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. Problems Table */}
                <div className={cx('tableCard')}>
                    <div className={cx('tableHeader')}>
                        <h3 className={cx('tableTitle')}>Danh sách bài tập ({filteredProblems.length})</h3>
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
                                {filteredProblems.length === 0 ? (
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
                                                            <span><FontAwesomeIcon icon={faClock} /> {p.timeLimit}</span>
                                                            <span><FontAwesomeIcon icon={faMemory} /> {p.memLimit}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={cx('categoryBadge')}>{p.category}</span>
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
                                                    {p.submissions}
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
                                                    {p.acRate}
                                                </td>
                                                <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                                                    {p.createdDate}
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
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button type="submit" className={cx('submitBtn')}>
                                        🚀 Xuất bản bài tập cho sinh viên
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
