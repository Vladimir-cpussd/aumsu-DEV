// src/pages/view_kat/LeftFilters.jsx
import React, { useState, useEffect } from 'react';

import './view_kat.css';

const LeftFilters = () => {
  // Состояния для фильтров
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lectures, setLectures] = useState([]);
  
  // Выбранные значения
  const [filters, setFilters] = useState({
    department: '',
    course: '',
    subject: '',
    lecture: ''
  });
  
  // Результаты фильтрации
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка начальных данных (кафедр)
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/departments');
        setDepartments(response.data);
      } catch (err) {
        setError(`Ошибка загрузки кафедр: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);

  // Загрузка курсов при изменении кафедры
  useEffect(() => {
    if (filters.department) {
      const fetchCourses = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/courses?department=${filters.department}`);
          setCourses(response.data);
          // Сбрасываем зависимые фильтры
          setFilters(prev => ({ ...prev, course: '', subject: '', lecture: '' }));
        } catch (err) {
          setError(`Ошибка загрузки курсов: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      
      fetchCourses();
    } else {
      setCourses([]);
      setFilters(prev => ({ ...prev, course: '', subject: '', lecture: '' }));
    }
  }, [filters.department]);

  // Загрузка предметов при изменении курса
  useEffect(() => {
    if (filters.course) {
      const fetchSubjects = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/subjects?course=${filters.course}`);
          setSubjects(response.data);
          // Сбрасываем зависимые фильтры
          setFilters(prev => ({ ...prev, subject: '', lecture: '' }));
        } catch (err) {
          setError(`Ошибка загрузки предметов: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubjects();
    } else {
      setSubjects([]);
      setFilters(prev => ({ ...prev, subject: '', lecture: '' }));
    }
  }, [filters.course]);

  // Загрузка лекций при изменении предмета
  useEffect(() => {
    if (filters.subject) {
      const fetchLectures = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/lectures?subject=${filters.subject}`);
          setLectures(response.data);
          // Сбрасываем зависимые фильтры
          setFilters(prev => ({ ...prev, lecture: '' }));
        } catch (err) {
          setError(`Ошибка загрузки лекций: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      
      fetchLectures();
    } else {
      setLectures([]);
      setFilters(prev => ({ ...prev, lecture: '' }));
    }
  }, [filters.subject]);

  // Обработчики изменений фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Отправка фильтров на сервер
  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Удаляем пустые фильтры из запроса
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await axios.get('/api/lectures/filter', {
        params: activeFilters
      });
      
      setResults(response.data);
    } catch (err) {
      setError(`Ошибка при фильтрации: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="left-filters">
      <h2>Фильтры</h2>
      
      <div className="filter-group">
        <label htmlFor="department">Кафедра:</label>
        <select 
          id="department"
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          disabled={loading}
        >
          <option value="">Все кафедры</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="course">Курс:</label>
        <select 
          id="course"
          name="course"
          value={filters.course}
          onChange={handleFilterChange}
          disabled={!filters.department || loading}
        >
          <option value="">Все курсы</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="subject">Предмет:</label>
        <select 
          id="subject"
          name="subject"
          value={filters.subject}
          onChange={handleFilterChange}
          disabled={!filters.course || loading}
        >
          <option value="">Все предметы</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="lecture">Лекция:</label>
        <select 
          id="lecture"
          name="lecture"
          value={filters.lecture}
          onChange={handleFilterChange}
          disabled={!filters.subject || loading}
        >
          <option value="">Все лекции</option>
          {lectures.map(lecture => (
            <option key={lecture.id} value={lecture.id}>{lecture.title}</option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={applyFilters}
        disabled={loading}
        className="apply-button"
      >
        {loading ? 'Загрузка...' : 'Применить фильтры'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="results-container">
        {loading ? (
          <div className="loading-indicator">Загрузка данных...</div>
        ) : results.length > 0 ? (
          <ul className="results-list">
            {results.map(item => (
              <li key={item.id} className="result-item">
                {item.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">Нет данных по выбранным фильтрам</p>
        )}
      </div>
    </div>
  );
};

export default LeftFilters;