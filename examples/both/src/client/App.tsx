import { useState } from "react";
import s from "./style.module.css";

export function App() {
	const [count, setCount] = useState(0);

	return (
		<div className={s.container}>
			<button className={s.button} onClick={() => setCount((current) => current + 1)}>
				{count}
			</button>
		</div>
	);
}
