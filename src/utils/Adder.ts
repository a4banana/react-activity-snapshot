export default class Adder {
	_partials: Float64Array
	_n: number

	constructor() {
		this._partials = new Float64Array( 32 )
		this._n =  0
	}

	add( x: number ) {
		const p = this._partials;
		let i = 0;
		for (let j = 0; j < this._n && j < 32; j++) {
			const y = p[j],
			hi = x + y,
			lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
			if (lo) p[i++] = lo;
			x = hi;
		}
		p[i] = x;
		this._n = i + 1;
		return this
	}

	valueOf() {
		const p = this._partials;
		let n = this._n, x, y, lo, hi = 0;
		lo = 0

		if (n > 0) {
			hi = p[--n];
			while (n > 0) {
				x = hi;
				y = p[--n];
				hi = x + y;
				lo = y - (hi - x);
				if (lo) break;
			}
			if ( n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
			y = lo * 2;
			x = hi + y;
			if (y == x - hi) hi = x;
			}
		}
		return hi;
	}
}