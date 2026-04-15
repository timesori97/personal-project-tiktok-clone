import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Admin = () => {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);

  const loadData = async () => {
    try {
      const sRes = await axiosInstance.get('/admin/stats');
      const rRes = await axiosInstance.get('/admin/reports');
      if (sRes.data) setStats(sRes.data);
      if (Array.isArray(rRes.data)) setReports(rRes.data);
    } catch (err) { console.error("관리자 데이터 로드 실패", err); }
  };

  useEffect(() => { loadData(); }, []);

  const handleProcess = async (reportId, targetId, type) => {
    if (!window.confirm("신고 내용을 승인하고 해당 영상을 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.post(`/admin/reports/${reportId}/process`, { 
        targetId: Number(targetId), type: type, action: 'DELETE' 
      });
      alert("처리가 완료되었습니다.");
      loadData();
    } catch (err) { alert("처리 실패"); }
  };

  const userCount = stats.USERCOUNT || 0;
  const videoCount = stats.VIDEOCOUNT || 0;
  const pendingCount = stats.PENDINGREPORTCOUNT || 0;

  return (
    <div style={{ padding: '30px 20px', color: 'white', backgroundColor: '#050505', minHeight: '100vh', overflowY: 'auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px' }}>
        🛡️ 대시보드 오버뷰
      </h2>
      
      {/* 💡 통계 카드 */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ background: '#111', padding: '24px', borderRadius: '12px', flex: '1 1 30%', border: '1px solid #222', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <h4 style={{ color: '#888', margin: 0, fontSize: '14px', fontWeight: '600' }}>총 가입 유저</h4>
          <p style={{ fontSize: '28px', color: '#fff', margin: '10px 0 0', fontWeight: '900' }}>{userCount}<span style={{fontSize:'16px', color:'#666'}}>명</span></p>
        </div>
        <div style={{ background: '#111', padding: '24px', borderRadius: '12px', flex: '1 1 30%', border: '1px solid #222', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <h4 style={{ color: '#888', margin: 0, fontSize: '14px', fontWeight: '600' }}>누적 영상</h4>
          <p style={{ fontSize: '28px', color: '#fff', margin: '10px 0 0', fontWeight: '900' }}>{videoCount}<span style={{fontSize:'16px', color:'#666'}}>개</span></p>
        </div>
        <div style={{ background: '#111', padding: '24px', borderRadius: '12px', flex: '1 1 30%', border: '1px solid #fe2c55', boxShadow: '0 4px 12px rgba(254,44,85,0.15)' }}>
          <h4 style={{ color: '#fe2c55', margin: 0, fontSize: '14px', fontWeight: '800' }}>대기 중 신고</h4>
          <p style={{ fontSize: '28px', color: '#fe2c55', margin: '10px 0 0', fontWeight: '900' }}>{pendingCount}<span style={{fontSize:'16px', color:'#888'}}>건</span></p>
        </div>
      </div>

      <h3 style={{ marginTop: '40px', marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>🚨 미처리 신고 목록</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {reports.map((r, i) => (
          <div key={i} style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ lineHeight: '1.6', flex: 1 }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                <span style={{color: '#888'}}>신고자:</span> <strong style={{color: '#fff'}}>@{r.REPORTERNAME || r.reporterName}</strong>
              </p>
              {(r.TARGETTYPE || r.targetType) === 'VIDEO' && (
                <div style={{ padding: '12px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #00f2fe' }}>
                  <p style={{ color: '#00f2fe', margin: 0, fontWeight: '700', fontSize: '15px' }}>🎥 {r.TARGETTITLE || r.targetTitle}</p>
                  <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '13px' }}>피신고자: @{r.TARGETOWNERNAME || r.targetOwnerName}</p>
                </div>
              )}
              <p style={{ margin: '12px 0 0 0', color: '#ffd700', fontSize: '14px', fontWeight: '600' }}>⚠️ 사유: {r.REASON || r.reason}</p>
              <span style={{ fontSize: '12px', color: '#555', display: 'block', marginTop: '6px' }}>{r.CREATEDAT || r.createdAt}</span>
            </div>
            
            {(r.STATUS === 'PENDING' || r.status === 'PENDING') ? (
              <button onClick={() => handleProcess(r.ID || r.id, r.TARGETID || r.targetId, r.TARGETTYPE || r.targetType)}
                style={{ background: '#fe2c55', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', flexShrink: 0 }}>
                삭제 처리 승인
              </button>
            ) : <span style={{ color: '#4ade80', fontWeight: '800', fontSize: '15px' }}>✅ 조치 완료</span>}
          </div>
        ))}
        {reports.length === 0 && <p style={{ textAlign: 'center', color: '#555', marginTop: '60px', fontWeight: '600' }}>현재 접수된 신고 내역이 없습니다.</p>}
      </div>
    </div>
  );
};

export default Admin;