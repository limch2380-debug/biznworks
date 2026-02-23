import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Shield, Key, Send, User, Phone, Calendar, CreditCard, LayoutDashboard, Activity
} from 'lucide-react';

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

const MainDashboard = () => {
    const [rooms, setRooms] = useState(generateRooms());
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filter, setFilter] = useState('all');

    const sections = [
        { title: "백단위 호실 (1층)", rooms: rooms.filter(r => r.id.startsWith('R') && parseInt(r.id.slice(1)) < 300) },
        { title: "천단위 호실 (2층)", rooms: rooms.filter(r => r.id.startsWith('R') && parseInt(r.id.slice(1)) >= 1000 && parseInt(r.id.slice(1)) < 2000) },
        { title: "이천단위 호실 (20층)", rooms: rooms.filter(r => r.id.startsWith('R') && parseInt(r.id.slice(1)) >= 2000) },
        { title: "비상주 센터", rooms: rooms.filter(r => r.id.startsWith('V')) }
    ];

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
                    {room.occupied && room.paymentDate && (
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

    const RoomDetails = ({ room }) => {
        const [local, setLocal] = useState(room);
        return (
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="detail-panel"
            >
                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', margin: '0 auto 20px', display: 'none' }} className="mobile-handle" />
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

                <button className="action-btn btn-primary" style={{ marginTop: '20px' }} onClick={() => {
                    setRooms(prev => prev.map(r => r.id === local.id ? local : r));
                    setSelectedRoom(null);
                }}>저장하기</button>

                <div style={{ marginTop: 'auto', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '15px' }}>스마트 오피스 제어</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Key size={14} /> 도어락</button>
                        <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Send size={14} /> 공지 발송</button>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div className="flex items-center" style={{ gap: '20px' }}>
                    <div style={{ background: '#00ffaa', padding: '8px', borderRadius: '8px' }}><LayoutDashboard color="black" size={20} /></div>
                    <h1 style={{ color: 'white', fontWeight: '900', fontSize: '20px', letterSpacing: '2px' }}>CUBE MOTION <span style={{ color: '#94a3b8', fontWeight: '300', fontSize: '14px' }}>REAL-TIME MONITORING</span></h1>
                </div>
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
            </header>

            <main className="dashboard-main">
                <div className="custom-scrollbar">
                    <div className="room-grid">
                        {sections.map(section => (
                            <React.Fragment key={section.title}>
                                {section.rooms.some(r => filter === 'all' ? true : filter === 'occupied' ? r.occupied : !r.occupied) && (
                                    <div className="room-section-header">{section.title}</div>
                                )}
                                {section.rooms.map(room => renderRoom(room))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="dashboard-footer">
                <div>CUBE MOTION OPERATIONS SYSTEM v2.5</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={10} color="#00ffaa" /> DATABASE CONNECTED</div>
            </footer>

            <AnimatePresence>
                {selectedRoom && <RoomDetails room={selectedRoom} />}
            </AnimatePresence>
        </div>
    );
};

export default MainDashboard;
