'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { SectionHeading, PremiumFooter } from '@/components/NikahComponents';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications?take=50');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/user/notifications?id=${id}`, {
        method: 'DELETE'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await fetch('/api/user/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notif.id })
        });
        fetchNotifications();
      } catch (error) {
        console.error('Failed to mark as read', error);
      }
    }
    
    if (notif.actionUrl) {
      window.location.href = notif.actionUrl;
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="container" style={{ padding: '40px 0 80px 0', maxWidth: '800px' }}>
          <SectionHeading
            title="Notifications"
            scriptText="Updates"
            subtitle="Your latest alerts and activities."
            as="h1"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button 
              onClick={markAllAsRead}
              disabled={notifications.length === 0}
              className="btn btn-secondary"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                opacity: notifications.length === 0 ? 0.5 : 1
              }}
            >
              Mark All as Read
            </button>
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              You have no notifications.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: notif.isRead ? 'white' : '#fff9f0',
                    border: '1px solid',
                    borderColor: notif.isRead ? 'var(--border-color)' : 'var(--gold-accent)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div 
                    style={{ flex: 1, cursor: 'pointer' }}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {!notif.isRead && <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary-brand)', borderRadius: '50%' }}></span>}
                      {notif.title}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '8px',
                      fontSize: '18px'
                    }}
                    aria-label="Delete Notification"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <PremiumFooter onNavigate={(view) => window.location.href = `/${view === 'home' ? '' : view}`} />
    </>
  );
}
