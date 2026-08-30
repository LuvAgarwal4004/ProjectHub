"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/app/loading";

export let setGlobalLoading;

export default function RouteLoader({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGlobalLoading = (val) => setLoading(val);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {children}
      <div className={`loader-wrapper ${loading ? "show" : "hide"}`}>
        <Loading />
      </div>
    </>
  );
}