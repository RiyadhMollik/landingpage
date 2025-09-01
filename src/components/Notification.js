'use client';

import React, { useEffect, useState } from "react";
import "./Notification.css";

const notifications = [
    { message: "হাসান রংপুর থেকে প্যারচেজ করেছেন", time: "1 মিনিট আগে" },
    { message: "রিমা ঢাকা থেকে প্যারচেজ করেছেন", time: "2 মিনিট আগে" },
    { message: "সুমন চট্টগ্রাম থেকে প্যারচেজ করেছেন", time: "3 মিনিট আগে" },
    { message: "আনিকা খুলনা থেকে প্যারচেজ করেছেন", time: "4 মিনিট আগে" },
    { message: "রাহুল বরিশাল থেকে প্যারচেজ করেছেন", time: "5 মিনিট আগে" },
    { message: "ফারহান সিলেট থেকে প্যারচেজ করেছেন", time: "6 মিনিট আগে" },
    { message: "মমতা কুমিল্লা থেকে প্যারচেজ করেছেন", time: "7 মিনিট আগে" },
    { message: "তানভীর ময়মনসিংহ থেকে প্যারচেজ করেছেন", time: "8 মিনিট আগে" },
    { message: "সাবিনা রাজশাহী থেকে প্যারচেজ করেছেন", time: "9 মিনিট আগে" },
    { message: "নাসিম কক্সবাজার থেকে প্যারচেজ করেছেন", time: "10 মিনিট আগে" },
    { message: "জান্নাত চাঁদপুর থেকে প্যারচেজ করেছেন", time: "11 মিনিট আগে" },
    { message: "আরিফ পিরোজপুর থেকে প্যারচেজ করেছেন", time: "12 মিনিট আগে" },
    { message: "সেলিনা নরসিংদী থেকে প্যারচেজ করেছেন", time: "13 মিনিট আগে" },
    { message: "মোস্তাফা যশোর থেকে প্যারচেজ করেছেন", time: "14 মিনিট আগে" },
    { message: "রুবিনা ভোলা থেকে প্যারচেজ করেছেন", time: "15 মিনিট আগে" },
    { message: "ইমরান শেরপুর থেকে প্যারচেজ করেছেন", time: "16 মিনিট আগে" },
    { message: "সেলিম গাইবান্ধা থেকে প্যারচেজ করেছেন", time: "17 মিনিট আগে" },
    { message: "মাহমুদ নেত্রকোণা থেকে প্যারচেজ করেছেন", time: "18 মিনিট আগে" },
    { message: "প্রীতি ফরিদপুর থেকে প্যারচেজ করেছেন", time: "19 মিনিট আগে" },
    { message: "কিরণ বগুড়া থেকে প্যারচেজ করেছেন", time: "20 মিনিট আগে" },
    { message: "নাফিস ঝালকাঠি থেকে প্যারচেজ করেছেন", time: "21 মিনিট আগে" },
    { message: "আলিফ মুন্সিগঞ্জ থেকে প্যারচেজ করেছেন", time: "22 মিনিট আগে" },
    { message: "শিশি পটুয়াখালী থেকে প্যারচেজ করেছেন", time: "23 মিনিট আগে" },
    { message: "হুমায়ুন চাঁপাইনবাবগঞ্জ থেকে প্যারচেজ করেছেন", time: "24 মিনিট আগে" },
    { message: "রুশদী সোনাগাজী থেকে প্যারচেজ করেছেন", time: "25 মিনিট আগে" },
    { message: "মাহনূন দিনাজপুর থেকে প্যারচেজ করেছেন", time: "26 মিনিট আগে" },
    { message: "জবা লালমনিরহাট থেকে প্যারচেজ করেছেন", time: "27 মিনিট আগে" },
    { message: "সুমাইয়া কিশোরগঞ্জ থেকে প্যারচেজ করেছেন", time: "28 মিনিট আগে" },
    { message: "মিঠু টাঙ্গাইল থেকে প্যারচেজ করেছেন", time: "29 মিনিট আগে" },
    { message: "রাশিদ বন্যারচর থেকে প্যারচেজ করেছেন", time: "30 মিনিট আগে" },
    { message: "সানি নারায়ণগঞ্জ থেকে প্যারচেজ করেছেন", time: "31 মিনিট আগে" },
    { message: "নাজমা শ্রীমঙ্গল থেকে প্যারচেজ করেছেন", time: "32 মিনিট আগে" },
    { message: "তাসনিম কিশোরগঞ্জ থেকে প্যারচেজ করেছেন", time: "33 মিনিট আগে" },
    { message: "ফারহা বান্দরবান থেকে প্যারচেজ করেছেন", time: "34 মিনিট আগে" },
    { message: "মিরাজ নওগাঁ থেকে প্যারচেজ করেছেন", time: "35 মিনিট আগে" },
];

export default function Notification() {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setVisible(true);
        const showTimeout = setTimeout(() => setVisible(false), 5000);

        const hideTimeout = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % notifications.length);
            setVisible(true);
        }, 6000);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
        };
    }, [current]);

    return (
        <div className={`notification ${visible ? "slide-in" : "slide-out"}`}>
            <div>🎉 {notifications[current].message}</div>
            <div style={{ fontSize: "14px" }}>⏰ {notifications[current].time}</div>
        </div>
    );
}