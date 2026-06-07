'use client';
import { useState, useLayoutEffect } from 'react';
export default function Test() {
  const [x, setX] = useState(0);
  useLayoutEffect(() => {
    setX(1);
  }, []);
  return <div>{x}</div>;
}
