
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

class LineMap {
    constructor() {
        this._lineStartPositions = [];
        this.addNextLineStart(0);
    }

    get lineCount() {
        return this._lineStartPositions.length;
    }

    startPosForLine(lineNum) {
        const lineId = lineNum - 1;
        return this._lineStartPositions[lineId];
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

// --

/*

class Tokenizer {
    constructor()

function codePointLength(str) {
    let codePoints = 0;
    for (let c of str) {
        codePoints += 1;
    }
    return codePoints;
}

function substringUntil(str, offset, endStr) {
    let endPos = str.indexOf(endStr, offset);
    if (endPos == -1) {
        endPos = str.length;
    }
    return str.substring(offset, endPos);
}

function substringIncluding(str, offset, endStr) {
    const endPos = str.indexOf(endStr, offset);
    if (endPos == -1)
        throw null;
    return str.substring(offset, endPos + endStr.length);
}

function repeatChar(c, n) {
    let ret = '';
    for (let i = 0; i < n; i++) {
        ret += c;
    }
    return ret;
}

class ExProblemAt {
    constructor(src, lineMap, offset) {
        this.lineNum = lineMap.lineNumForPos(offset);
        const lineStart = lineMap.startPosForLine(this.lineNum);
        this.linePos = codePointLength(text.substring(lineStart, offset));

        this.problemLine = substringUntil(text, lineStart, '\n');
        this.problemPointerLine = repeatChar('-', this.linePos) + '^';
    }
}



class ExUnmatchedTokenStart extends ExProblemAt {
    constructor(src, lineMap, offset, startStr, endStr) {
        super(src, lineMap, offset);

        const lineNumStr = '[L' + this.lineNum + ']';
        this.message = [
            '[L${this.lineNum}:${this.linePos}] "${startStr}" has no matching "${endStr}".',
            lineNumStr + this.problemLine,
            repeatChar(' ', lineNumStr.length) + this.problemPointerLine,
        ].join('\n');
    }

    toString() {
        return this.message;
    }
}
*/

class ExBadToken {
    constructor(src, startPos, endPos=-1) {
        if (endPos == -1) {
            endPos = src.length;
        }
        this.badToken = src.substring(startPos, endPos);
    }

    toString() {
        return 'ExBadToken: "${this.badToken}"';
    }
}

class TokenizePass {
    constructor(src) {
        this._src = src;
        this._lineMap = new LineMap();
    }

    get src() { return this._src; }
    get lineMap() { return this._lineMap; }

    badToken(startPos, endPos=-1) {
        return new ExBadToken(this._src, startPos, endPos);
    }

    findMatchingQuote(startPos) {
        const quoteChar = this._src[startPos];
        for (let i = startPos+1; i < this._src.length; i++) {
            const cur = this._src[i];
            if (cur == '\\') {
                i++;
                continue;
            }
            if (cur == quoteChar)
                return i;
        }
        return -1;
    }

    substringUntil(startPos, endStr) {
        let endPos = this._src.indexOf(endStr, startPos);
        if (endPos == -1) {
            endPos = this._src.length;
        }
        return this._src.substring(startPos, endPos);
    }

    tokenizeWith(fnNextToken) {
        let curPos = 0;
        const tokens = [];
        while (curPos < this._src.length) {
            const [consumed, emitted] = fnNextToken(this, curPos);
            if (emitted) {
                tokens.push(emitted);
            }
            for (let i in consumed) {
                curPos += 1;
                const c = consumed[i];
                if (c == '\n') {
                    this._lineMap.addNextLineStart(curPos);
                }
            }
        }
        return tokens;
    }
}
