'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications?take=5');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={toggleDropdown}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            fontSize: '10px',
            padding: '2px 6px',
            fontWeight: 'bold'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '300px',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          zIndex: 100,
          border: '1px solid #eee',
          marginTop: '8px'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--primary-dark)' }}>Notifications</h4>
            <Link href="/my-account/notifications" style={{ fontSize: '12px', color: 'var(--primary-brand)', textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
              View All
            </Link>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
                No recent notifications
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div 
                  key={notif.id} 
                  style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #f5f5f5',
                    backgroundColor: notif.isRead ? 'transparent' : '#f9f9f9',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (!notif.isRead) markAsRead(notif.id);
                    if (notif.actionUrl) {
                      window.location.href = notif.actionUrl;
                    }
                  }}
                >
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: notif.isRead ? 'normal' : 'bold', color: 'var(--text-primary)' }}>
                    {notif.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '10px', color: '#999', marginTop: '4px', display: 'block' }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
