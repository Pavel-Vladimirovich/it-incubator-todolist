import {sum} from './Counter'

test ('function sum should be correct', ()=> {
	const a = 1;
	const b = 2;
	const c = 1;

	const result = sum(a,b);

	expect (result).toBe(3)
})