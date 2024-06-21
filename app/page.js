"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // استخدام next/navigation بدلاً من next/router

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return null; // الصفحة الرئيسية ستكون فارغة لأننا نعيد التوجيه
}