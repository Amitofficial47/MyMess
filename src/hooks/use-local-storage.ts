"use client";

import { useState, useEffect } from "react";

function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
	const [storedValue, setStoredValue] = useState<T>(initialValue);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) {
			return;
		}
		try {
			const item = window.localStorage.getItem(key);
			setStoredValue(item ? JSON.parse(item) : initialValue);
		} catch (error) {
			console.error(error);
			setStoredValue(initialValue);
		}
	}, [key, initialValue, isMounted]);

	const setValue = (value: T | ((val: T) => T)) => {
		if (!isMounted) {
			return;
		}
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
		}
	};

	return [storedValue, setValue];
}

export { useLocalStorage };
