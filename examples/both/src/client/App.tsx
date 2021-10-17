import { useState } from "react";
import s from "./style.module.scss";

export function App() {
	const [count, setCount] = useState(0);

	return (
		<div className={s.container}>
			<button onClick={() => setCount((current) => current + 1)}>{count}</button>
		</div>
	);
}
