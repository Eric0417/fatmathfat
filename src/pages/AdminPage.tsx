import {
  Download,
  Edit3,
  RefreshCw,
  Trash2,
  UserPlus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AdminStudent {
  id: number;
  email: string;
  role: string;
  last_login_at?: string | null;
  last_seen_at?: string | null;
  completed_lessons: string[];
  practice_count: number;
  quiz_count: number;
  latest_quiz?: {
    score: number;
    correct: number;
    total: number;
    completed_at: string;
  } | null;
}

interface AdminLearningData {
  students: AdminStudent[];
  total_students: number;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('zh-Hant', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

export function AdminPage() {
  const { apiFetch } = useAuth();
  const [data, setData] = useState<AdminLearningData | null>(null);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentData, teacherData] = await Promise.all([
        apiFetch<AdminLearningData>('/api/admin/students'),
        apiFetch<string[]>('/api/admin/teachers')
      ]);
      setData(studentData);
      setTeachers(teacherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入管理資料失敗。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const addTeacher = async () => {
    setError('');
    setNotice('');
    if (!newTeacher.trim()) return;
    try {
      await apiFetch('/api/admin/teachers', {
        method: 'POST',
        body: JSON.stringify({ email: newTeacher.trim() })
      });
      setNewTeacher('');
      setNotice('已加入管理員。');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '加入管理員失敗。');
    }
  };

  const removeTeacher = async (email: string) => {
    setError('');
    setNotice('');
    try {
      await apiFetch(`/api/admin/teachers/${encodeURIComponent(email)}`, {
        method: 'DELETE'
      });
      setNotice('已移除管理員。');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : '移除管理員失敗。');
    }
  };

  const downloadData = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `集合好好學-學生數據-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">教師管理</span>
          <h1>學生學習數據</h1>
          <p>查看學生上線時間、練習次數、測驗成績與最近活動。</p>
        </div>
        <div className="button-row">
          <button className="button button--ghost" type="button" onClick={load}>
            <RefreshCw size={17} aria-hidden="true" />
            重新整理
          </button>
          <button className="button button--ghost" type="button" onClick={downloadData}>
            <Download size={17} aria-hidden="true" />
            下載
          </button>
        </div>
      </div>

      <section className="panel admin-teacher-panel" aria-labelledby="teacher-title">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">管理員白名單</span>
            <h2 id="teacher-title">管理員帳號</h2>
          </div>
          <span className="admin-count">{teachers.length} 位</span>
        </div>
        <div className="admin-teacher-form">
          <input
            type="email"
            value={newTeacher}
            onChange={(event) => setNewTeacher(event.target.value)}
            placeholder="輸入管理員郵箱"
            aria-label="管理員郵箱"
          />
          <button className="button button--primary" type="button" onClick={addTeacher}>
            <UserPlus size={17} aria-hidden="true" />
            加入
          </button>
        </div>
        <div className="admin-teacher-list">
          {teachers.map((teacher) => (
            <div className="admin-teacher-row" key={teacher}>
              <span>
                <strong>{teacher}</strong>
                <small>管理員</small>
              </span>
              <button
                className="icon-button"
                type="button"
                aria-label={`移除 ${teacher}`}
                onClick={() => removeTeacher(teacher)}
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="confirmation-note" role="alert">
          <Edit3 size={16} aria-hidden="true" />
          {error}
        </p>
      )}
      {notice && (
        <p className="confirmation-note confirmation-note--ok" role="status">
          {notice}
        </p>
      )}

      <section className="panel admin-students-panel" aria-labelledby="students-title">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">學生</span>
            <h2 id="students-title">{data?.total_students ?? 0} 位學生</h2>
          </div>
        </div>
        {loading ? (
          <p className="admin-loading">正在載入...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>學生</th>
                  <th>最後登入</th>
                  <th>最後活動</th>
                  <th>單元</th>
                  <th>練習</th>
                  <th>測驗</th>
                  <th>最近成績</th>
                </tr>
              </thead>
              <tbody>
                {data?.students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.email}</td>
                    <td>{formatDate(student.last_login_at)}</td>
                    <td>{formatDate(student.last_seen_at)}</td>
                    <td>{student.completed_lessons.length}</td>
                    <td>{student.practice_count}</td>
                    <td>{student.quiz_count}</td>
                    <td>
                      {student.latest_quiz
                        ? `${student.latest_quiz.score} 分`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
