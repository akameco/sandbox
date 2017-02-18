'use strict';

const interleave = (strings, is) =>
	is.reduce((arr, interp, i) =>
		arr.concat(interp, strings[i + 1])
	, [strings[0]]);

const isFunction = x => typeof x === 'function';
const inject = (chunks, context) => {
	return chunks.reduce((arr, chunk) => {
		if (Array.isArray(chunk)) {
			return [...arr, ...inject(chunk, context)];
		}
		return isFunction(chunk) ? arr.concat(...inject([chunk(context)], context)) : arr.concat(chunk);
	}, []);
};

class Text {
	constructor(props) {
		this.context = props;
	}
	format(strings, ...args) {
		return inject(interleave(strings, args), this.context).join('').replace(/\s|\n/g, '');
	}
}

const flex = new Text({display: 'flex'});
const none = new Text({display: 'none'});

console.log(flex.format`
	display: ${x => x.display};
	width: ${x => x.display === 'flex' ? 100 : 0}px;
	height: ${x => x.display === 'flex' ? 100 : 0}px;
`);

console.log(none.format`
	display: ${x => x.display};
	width: ${x => x.display === 'flex' ? 100 : 0}px;
	height: ${x => x.display === 'flex' ? 100 : 0}px;
`);
