import React, { createContext, useContext, useState, useEffect } from 'react';
import { VAPID_PUBLIC_KEY } from '../config';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [permission, setPermission] = useState(Notification.permission);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setIsSupported(false);
            return;
        }

        checkSubscription();
    }, []);

    const checkSubscription = async () => {
        // Init fingerprint if not exists (Parity with legacy)
        if (!localStorage.getItem('user_fingerprint')) {
            const fingerprint = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('user_fingerprint', fingerprint);
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribe = async () => {
        try {
            const requestedPermission = await Notification.requestPermission();
            setPermission(requestedPermission);

            if (requestedPermission !== 'granted') return false;

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            // Kirim ke backend API kita
            const fingerprint = localStorage.getItem('user_fingerprint') || Math.random().toString(36).substring(7);
            if (!localStorage.getItem('user_fingerprint')) localStorage.setItem('user_fingerprint', fingerprint);

            await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription,
                    userId: fingerprint
                })
            });

            setIsSubscribed(true);
            return true;
        } catch (error) {
            console.error('Subscription error:', error);
            return false;
        }
    };

    const unsubscribe = async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            setIsSubscribed(false);
        }
    };

    return (
        <NotificationContext.Provider value={{ permission, isSubscribed, isSupported, subscribe, unsubscribe }}>
            {children}
        </NotificationContext.Provider>
    );
};
