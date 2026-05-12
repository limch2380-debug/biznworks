import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Key, Send, User, Phone, Calendar, CreditCard, LayoutDashboard, Activity,
    Download, Upload, Save, CheckCircle, Plus, Minus, Trash2, AlertTriangle
} from 'lucide-react';

// ===== 초기 기본 데이터 (최초 1회만 사용, 이후 저장된 데이터 우선) =====
const initialDataMap = {
    "101": { company: "김고범 (1년/180만)", contact: "010-8719-3052", entryDate: "2024-12-04", paymentDate: "4일", occupied: true, note: "25.12.4일까지" },
    "102": { company: "1영 (1년/330만)", contact: "010-5722-0925", entryDate: "2025-04-23", paymentDate: "23일", occupied: true },
    "103": { company: "성우대표 (월20)", contact: "-", entryDate: "2025-04-07", paymentDate: "7일", occupied: true },
    "104": { company: "유수운 (1년/100만)", contact: "010-5001-8500", entryDate: "2025-05-08", paymentDate: "8일", occupied: true },
    "105": { company: "부동산", contact: "-", entryDate: "-", paymentDate: "-", occupied: true },
    "106": { company: "고은희 (월20)", contact: "010-4167-6220", entryDate: "2025-01-29", paymentDate: "29일", occupied: true, note: "매월 20일 결제" },
    "107": { company: "승택 (월20)", contact: "-", entryDate: "2025-08-05", paymentDate: "5일", occupied: true },
    "201": { company: "안홍민 (1년/55만)", contact: "010-4477-8561", entryDate: "2025-10-27", paymentDate: "27일", occupied: true, note: "비상주 입주" },
    "1001": { company: "페이로 양동환 (6개월/110만)", contact: "010-6356-2416", entryDate: "2024-09-08", paymentDate: "8일", occupied: true, note: "세금계산서 발행" },
    "1002": { company: "허정 (15만)", contact: "010-8480-0484", entryDate: "2025-01-01", paymentDate: "1일", occupied: true },
    "1003": { company: "한국그리드포밍 (월22)", contact: "010-7707-5367", entryDate: "2025-09-25", paymentDate: "25일", occupied: true },
    "1004": { company: "부동산 김승자 (월20)", contact: "010-7487-6677", entryDate: "2025-11-13", paymentDate: "13일", occupied: true },
    "1006": { company: "대부업 (150만)", contact: "010-5456-8271", entryDate: "2024-10-30", paymentDate: "30일", occupied: true, note: "27.10.30일까지" },
    "1011": { company: "이재석 컴짱 (보10/월15)", contact: "010-7135-5413", entryDate: "2024-09-16", paymentDate: "16일", occupied: true },
    "1012": { company: "방성원 여행사 (1년/120)", contact: "-", entryDate: "2025-03-25", paymentDate: "25일", occupied: true },
    "1013": { company: "비상주 / 류예주", contact: "-", entryDate: "2025-01-02", paymentDate: "2일", occupied: true },
    "1014": { company: "원이냉삼 성원형 (1년/120)", contact: "-", entryDate: "2025-03-25", paymentDate: "25일", occupied: true },
    "1016": { company: "대부업 (6개월/90만)", contact: "010-9447-1243 / 010-7131-1212", entryDate: "2025-10-21", paymentDate: "21일", occupied: true, note: "26.4.21일까지" },
    "1017": { company: "성원형 미푸드 (1년/120)", contact: "-", entryDate: "2025-06-19", paymentDate: "19일", occupied: true },
    "1018": { company: "경만성", contact: "-", entryDate: "2024-06-01", paymentDate: "1일", occupied: true },
    "1019": { company: "대부업 (1년/200)", contact: "-", entryDate: "2025-06-24", paymentDate: "24일", occupied: true },
    "1020": { company: "이수창 대부업 (보10/월15)", contact: "010-2018-7033", entryDate: "-", paymentDate: "-", occupied: true },
    "1021": { company: "의료기기 (1년/198)", contact: "010-2018-7033", entryDate: "2024-12-04", paymentDate: "4일", occupied: true, note: "계산서 포함" },
    "1022": { company: "허선아 (1년/132만)", contact: "010-8663-9753", entryDate: "2025-01-01", paymentDate: "1일", occupied: true, note: "보10" },
    "1023": { company: "대부업 (120만)", contact: "010-9448-5102", entryDate: "2025-05-16", paymentDate: "16일", occupied: true },
    "2003": { company: "고용수", contact: "-", entryDate: "-", paymentDate: "-", occupied: true },
    "V1": { company: "비상주 3개월 (15만)", contact: "010-4242-7343", entryDate: "2025-12-27", paymentDate: "27일", occupied: true, note: "26.3.27일까지" },
    "V2": { company: "비상주 3개월 (15만)", contact: "010-6766-6774", entryDate: "2025-12-31", paymentDate: "31일", occupied: true, note: "3.30일까지" },
    "V3": { company: "비상주 1년 (30만)", contact: "010-4785-8804", entryDate: "2026-01-12", paymentDate: "12일", occupied: true, note: "27.12일까지" },
    "V4": { company: "비상주 양승우 (1년/33만)", contact: "010-8960-4869", entryDate: "2026-01-20", paymentDate: "20일", occupied: true }
};

const STORAGE_KEY = 'cubeMotion_officeData_v2';

const generateRooms = () => {
    const rooms = [];
    const ranges = [
        { start: 101, end: 107, type: 'Office-A' },
        { start: 201, end: 204, type: 'Office-A' },
        { start: 1001, end: 1023, type: 'Office-B' },
        { start: 2001, end: 2005, type: 'Office-C' }
    ];

    ranges.forEach(range => {
        for (let i = range.start; i <= range.end; i++) {
            const data = initialDataMap[i.toString()] || { company: '', contact: '', entryDate: '', paymentDate: '', occupied: false, note: '' };
            rooms.push({ id: `R${i}`, name: `${i}호`, type: range.type, ...data });
        }
    });

    for (let i = 1; i <= 20; i++) {
        const data = initialDataMap[`V${i}`] || { company: '', contact: '', entryDate: '', paymentDate: '', occupied: false, note: '' };
        rooms.push({ id: `V${i}`, name: `비상주 ${i}`, type: 'Virtual', ...data });
    }

    return rooms;
};

// ===== 안전한 localStorage 읽기/쓰기 =====
const loadRooms = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // 데이터 유효성 검증: 배열이고 최소 1개 이상의 항목이 있어야 함
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
                console.log(`[CubeMotion] ✅ 저장된 데이터 ${parsed.length}개 로드 완료`);
                return parsed;
            }
        }
    } catch (e) {
        console.error('[CubeMotion] ❌ 저장 데이터 읽기 실패:', e);
    }
    console.log('[CubeMotion] 📦 초기 데이터로 시작합니다.');
    return generateRooms();
};

const saveRooms = (rooms) => {
    try {
        const json = JSON.stringify(rooms);
        localStorage.setItem(STORAGE_KEY, json);
        // 검증: 저장 직후 다시 읽어서 확인
        const verify = localStorage.getItem(STORAGE_KEY);
        if (verify === json) {
            console.log(`[CubeMotion] 💾 데이터 저장 성공 (${rooms.length}개 호실)`);
            return true;
        } else {
            console.error('[CubeMotion] ❌ 저장 검증 실패');
            return false;
        }
    } catch (e) {
        console.error('[CubeMotion] ❌ 데이터 저장 실패:', e);
        return false;
    }
};

// ===== 메인 대시보드 컴포넌트 =====
const MainDashboard = () => {
    const [rooms, setRooms] = useState(loadRooms);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filter, setFilter] = useState('all');
    const [saveToast, setSaveToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('저장 완료!');
    const [deleteConfirm, setDeleteConfirm] = useState(null); // 삭제 확인용
    const fileInputRef = useRef(null);

    // rooms 변경 시 자동 저장
    useEffect(() => {
        saveRooms(rooms);
    }, [rooms]);

    // 다른 탭/창에서 변경된 localStorage 감지
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setRooms(parsed);
                    }
                } catch (err) { /* 무시 */ }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const sections = [
        { key: 'floor1', title: "백단위 호실 (1층)", rooms: rooms.filter(r => r.id.startsWith('R') && parseInt(r.id.slice(1)) < 300), rangeStart: 100, rangeEnd: 299, type: 'Office-A' },
        { key: 'floor2', title: "천단위 호실 (2층)", rooms: rooms.filter(r => r.id.startsWith('R') && parseInt(r.id.slice(1)) >= 1000 && parseInt(r.id.slice(1)) < 2000), rangeStart: 1000, rangeEnd: 1999, type: 'Office-B' },
        { key: 'floor20', title: "이천단위 호실 (20층)", rooms: rooms.filter(r => r.id.startsWith('R') && parseInt(r.id.slice(1)) >= 2000), rangeStart: 2000, rangeEnd: 2999, type: 'Office-C' },
        { key: 'virtual', title: "비상주 센터", rooms: rooms.filter(r => r.id.startsWith('V')), rangeStart: 0, rangeEnd: 0, type: 'Virtual' }
    ];

    // ===== 호실 추가 =====
    const handleAddRoom = useCallback((section) => {
        const sectionRooms = section.rooms;

        if (section.key === 'virtual') {
            // 비상주: V1, V2, ... 형태
            const existingNums = sectionRooms.map(r => parseInt(r.id.replace('V', ''))).filter(n => !isNaN(n));
            const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
            const newRoom = {
                id: `V${nextNum}`, name: `비상주 ${nextNum}`, type: 'Virtual',
                company: '', contact: '', entryDate: '', paymentDate: '', occupied: false, note: ''
            };
            setRooms(prev => [...prev, newRoom]);
            setToastMessage(`비상주 ${nextNum} 추가 완료!`);
        } else {
            // 일반 호실: R101, R1001 등
            const existingNums = sectionRooms.map(r => parseInt(r.id.replace('R', ''))).filter(n => !isNaN(n));
            const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : section.rangeStart + 1;
            // 범위 초과 체크
            if (nextNum > section.rangeEnd) {
                alert(`${section.title} 범위(${section.rangeStart}~${section.rangeEnd})를 초과했습니다.`);
                return;
            }
            const newRoom = {
                id: `R${nextNum}`, name: `${nextNum}호`, type: section.type,
                company: '', contact: '', entryDate: '', paymentDate: '', occupied: false, note: ''
            };
            setRooms(prev => [...prev, newRoom]);
            setToastMessage(`${nextNum}호 추가 완료!`);
        }
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2500);
    }, []);

    // ===== 호실 삭제 (마지막 호실) =====
    const handleRemoveLastRoom = useCallback((section) => {
        const sectionRooms = section.rooms;
        if (sectionRooms.length === 0) return;

        // 마지막 호실 가져오기
        const lastRoom = sectionRooms[sectionRooms.length - 1];

        // 입주 중인 호실 삭제 경고
        if (lastRoom.occupied && lastRoom.company) {
            const ok = window.confirm(`[${lastRoom.name}] ${lastRoom.company}\n\n입주 중인 호실입니다. 정말 삭제하시겠습니까?`);
            if (!ok) return;
        }

        setRooms(prev => prev.filter(r => r.id !== lastRoom.id));
        setToastMessage(`${lastRoom.name} 삭제 완료`);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2500);
    }, []);

    // ===== 특정 호실 삭제 (상세패널에서) =====
    const handleDeleteRoom = useCallback((roomId) => {
        setRooms(prev => prev.filter(r => r.id !== roomId));
        setSelectedRoom(null);
        setDeleteConfirm(null);
        setToastMessage('호실 삭제 완료');
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2500);
    }, []);

    // ===== 백업 다운로드 (JSON 파일로 내보내기) =====
    const handleExportData = useCallback(() => {
        const data = JSON.stringify(rooms, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
        a.href = url;
        a.download = `CubeMotion_백업_${dateStr}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [rooms]);

    // ===== 백업 복원 (JSON 파일 가져오기) =====
    const handleImportData = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id) {
                    setRooms(parsed);
                    setSaveToast(true);
                    setTimeout(() => setSaveToast(false), 2500);
                } else {
                    alert('올바른 백업 파일이 아닙니다.');
                }
            } catch (err) {
                alert('파일 읽기 오류: ' + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // 같은 파일 재선택 허용
    }, []);

    const renderRoom = (room) => {
        const isFiltered = filter === 'all' ? true : filter === 'occupied' ? room.occupied : !room.occupied;
        if (!isFiltered) return null;

        return (
            <div key={room.id} className={`room-card ${room.occupied ? 'occupied' : 'vacant'}`} onClick={() => setSelectedRoom(room)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p className="room-name">{room.name}</p>
                        <p className="room-status" style={{ color: room.occupied ? '#ff3366' : '#00ffaa' }}>{room.occupied ? '입주 중' : '공실'}</p>
                    </div>
                    {room.occupied && room.paymentDate && room.paymentDate !== '-' && (
                        <div style={{
                            background: 'rgba(0, 255, 170, 0.15)',
                            border: '1px solid rgba(0, 255, 170, 0.5)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#00ffaa',
                            fontWeight: '900',
                            boxShadow: '0 0 10px rgba(0, 255, 170, 0.2)'
                        }}>
                            {room.paymentDate} 입금
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '15px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                        {room.occupied ? room.company : '-'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
                        {room.occupied ? (room.contact !== '-' ? room.contact : '연락처 없음') : '입주 가능'}
                    </p>
                </div>
            </div>
        );
    };

    const handleSaveRoom = useCallback((local) => {
        setRooms(prev => {
            const updated = prev.map(r => r.id === local.id ? { ...local } : r);
            return updated;
        });
        setSelectedRoom(null);
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2500);
    }, []);

    const RoomDetails = ({ room }) => {
        const [local, setLocal] = useState({ ...room });
        return (
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="detail-panel"
            >
                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 20px' }} className="mobile-handle" />
                <button onClick={() => setSelectedRoom(null)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                <div style={{ marginBottom: '40px' }}>
                    <p style={{ color: '#00ffaa', fontSize: '10px', fontWeight: 'bold' }}>{room.type} UNIT</p>
                    <h2 style={{ fontSize: '32px', color: 'white', fontWeight: '900' }}>{room.name}</h2>
                </div>

                <div className="input-group">
                    <label><User size={10} /> 입주사 정보 / 비고</label>
                    <input value={local.company} onChange={e => setLocal({ ...local, company: e.target.value, occupied: !!e.target.value })} placeholder="비어있음" />
                </div>
                <div className="input-group">
                    <label><Phone size={10} /> 연락처</label>
                    <input value={local.contact} onChange={e => setLocal({ ...local, contact: e.target.value })} placeholder="010-0000-0000" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="input-group">
                        <label><Calendar size={10} /> 입주일</label>
                        <input value={local.entryDate} onChange={e => setLocal({ ...local, entryDate: e.target.value })} placeholder="25.01.01" />
                    </div>
                    <div className="input-group">
                        <label><CreditCard size={10} /> 결제일</label>
                        <input value={local.paymentDate} onChange={e => setLocal({ ...local, paymentDate: e.target.value })} placeholder="매월 25일" />
                    </div>
                </div>
                <div className="input-group">
                    <label>특이사항</label>
                    <input value={local.note || ''} onChange={e => setLocal({ ...local, note: e.target.value })} placeholder="계약 기간 및 조건" />
                </div>

                <button className="action-btn btn-primary" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => handleSaveRoom(local)}>
                    <Save size={16} /> 저장하기
                </button>

                <div style={{ marginTop: 'auto', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '15px' }}>스마트 오피스 제어</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Key size={14} /> 도어락</button>
                        <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Send size={14} /> 공지 발송</button>
                    </div>
                </div>

                {/* 호실 삭제 영역 */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,51,102,0.15)' }}>
                    {deleteConfirm === room.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff3366', fontSize: '12px', fontWeight: 'bold' }}>
                                <AlertTriangle size={14} /> 정말 이 호실을 삭제하시겠습니까?
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className="action-btn"
                                    style={{ background: '#ff3366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
                                    onClick={() => handleDeleteRoom(room.id)}
                                >
                                    <Trash2 size={14} /> 삭제 확인
                                </button>
                                <button
                                    className="action-btn btn-outline"
                                    style={{ fontSize: '13px' }}
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="action-btn"
                            style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.3)', color: '#ff3366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px' }}
                            onClick={() => setDeleteConfirm(room.id)}
                        >
                            <Trash2 size={14} /> 이 호실 삭제
                        </button>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#00ffaa', padding: '8px', borderRadius: '8px' }}><LayoutDashboard color="black" size={20} /></div>
                    <h1 style={{ color: 'white', fontWeight: '900', fontSize: '20px', letterSpacing: '2px' }}>CUBE MOTION <span style={{ color: '#94a3b8', fontWeight: '300', fontSize: '14px' }}>REAL-TIME</span></h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* 백업/복원 버튼 */}
                    <button onClick={handleExportData} title="데이터 백업 다운로드" style={{ background: 'rgba(0, 255, 170, 0.1)', border: '1px solid rgba(0, 255, 170, 0.3)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#00ffaa', fontSize: '11px', fontWeight: 'bold' }}>
                        <Download size={14} /> <span className="hide-mobile">백업</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} title="백업 파일 복원" style={{ background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#ffaa00', fontSize: '11px', fontWeight: 'bold' }}>
                        <Upload size={14} /> <span className="hide-mobile">복원</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />

                    {/* 필터 버튼 */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '5px', borderRadius: '10px', gap: '5px' }}>
                        {['all', 'occupied', 'vacant'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', background: filter === f ? 'rgba(255,255,255,0.1)' : 'transparent', color: filter === f ? '#00ffaa' : '#94a3b8' }}
                            >
                                {f === 'all' ? '전체' : f === 'occupied' ? '입주' : '공실'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="custom-scrollbar">
                    <div className="room-grid">
                        {sections.map(section => (
                            <React.Fragment key={section.key}>
                                {section.rooms.some(r => filter === 'all' ? true : filter === 'occupied' ? r.occupied : !r.occupied) && (
                                    <div className="room-section-header">
                                        <span>{section.title}</span>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>({section.rooms.length}실)</span>
                                        <div className="section-controls">
                                            <button
                                                className="section-ctrl-btn add"
                                                onClick={(e) => { e.stopPropagation(); handleAddRoom(section); }}
                                                title="호실 추가"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                className="section-ctrl-btn remove"
                                                onClick={(e) => { e.stopPropagation(); handleRemoveLastRoom(section); }}
                                                title="마지막 호실 삭제"
                                                disabled={section.rooms.length === 0}
                                            >
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {section.rooms.map(room => renderRoom(room))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="dashboard-footer">
                <div>CUBE MOTION v3.0</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={10} color="#00ffaa" /> 입주 {rooms.filter(r => r.occupied).length} / 공실 {rooms.filter(r => !r.occupied).length}
                </div>
            </footer>

            <AnimatePresence>
                {selectedRoom && <RoomDetails room={selectedRoom} />}
            </AnimatePresence>

            {/* 저장 완료 토스트 알림 */}
            <AnimatePresence>
                {saveToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
                            background: 'rgba(0, 255, 170, 0.15)', border: '1px solid rgba(0, 255, 170, 0.5)',
                            backdropFilter: 'blur(20px)', padding: '12px 24px', borderRadius: '12px',
                            color: '#00ffaa', fontSize: '14px', fontWeight: 'bold', zIndex: 999,
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 0 30px rgba(0, 255, 170, 0.2)'
                        }}
                    >
                        <CheckCircle size={18} /> {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MainDashboard;
