
function fnLess(a, b) { return a < b; }

function bisect(x, arr, fnLess=fnLess) {
    let left = 0;
    let right = arr.length;
    while (left != right) {
        const mid = ((left + right) / 2)|0;
        if (fnLess(x, arr[mid])) {
            right = mid;
        } else {
            left = mid;
        }
    }
    return fnLess(x, arr[left]) ? left : left+1;
}

class LineTracker {
    constructor(charItr) {
        this._itr = charItr;
        this._curPos = 0;
        this._lineStartPositions = [0];
    }

    next() {
        const res = this._itr.next();
        this._curPos += 1;

        if (!res.done && res.value == '\n') {
            this._lineStartPositions.push(this._curPos);
        }
        return res;
    }

    get lineStartPositions() { return this._lineStartPositions; }

    lineNumForPos(pos) {
        const lineId = bisect(x, this._lineStartPositions);
        const lineNum = lineId + 1;
        return lineNum;
    }
}

class LineMap {
    constructor() {
        this._lineStartPositions = [];
        this.addNextLineStart(0);
    }

    get lineStartList() {
        return this._lineStartPositions;
    }

    addNextLineStart(pos) {
        this._lineStartPositions.push(pos);
    }

    lineNumForPos(pos) {
        const lineId = bisect(x, this._lineStartPositions);
        const lineNum = lineId + 1;
        return lineNum;
    }
}

function tokenizeSpirv(text, offset, lineMap) {

}

class Tokenizer {
    constructor(text) {
        this._text = text;
        this._curPos = 0;
        this._lineMap = new LineMap();
    }






function* tokenize(text) {
    let

function* tokenize(src, spanList) {
    const iter = src[Symbol.iterator]();
    const tokens = [];

    while (true) {
        const c = iter.next();
        if (c.done)
            break;
        line = line.trim();
        if (!line)
            break;

        if (line[0] == ';') {
            tokens.push(line);
            break;
        }

        if (line[0] == '"') {





