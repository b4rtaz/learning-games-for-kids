(function (root, factory) {
    const engine = factory();
    if (typeof module === 'object' && module.exports) module.exports = engine;
    root.PatternEngine = engine;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond'];
    const COLORS = ['#ff5f7e', '#ffb627', '#36bfa6', '#4f7cff', '#925fe2'];
    const SIZES = ['small', 'medium', 'large', 'extra-large'];
    const POSITIONS = ['top', 'right', 'bottom', 'left'];

    function clone(item) {
        return Object.assign({}, item);
    }

    function item(overrides) {
        return Object.assign({
            shape: 'circle',
            color: COLORS[0],
            count: 1,
            size: 'medium',
            rotation: 0,
            position: 'center'
        }, overrides);
    }

    function pickDifferent(values, current, offset) {
        const index = values.indexOf(current);
        return values[(index + offset) % values.length];
    }

    function firstOther(values, excluded) {
        return values.find(value => !excluded.includes(value));
    }

    function makeDistractors(answer, changes) {
        return changes.map(change => item(Object.assign({}, answer, change)));
    }

    // Every rule can be understood from the three visible cards by a young child.
    // Most use the familiar A-B-A pattern; the two growth rules change one feature only.
    const TEMPLATES = [
        {
            id: 'count-up',
            build(random) {
                const base = { shape: random.pick(SHAPES), color: random.pick(COLORS), size: 'small' };
                const sequence = [1, 2, 3].map(count => item(Object.assign({}, base, { count })));
                const answer = item(Object.assign({}, base, { count: 4 }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ count: 2 }, { count: 3 }]) };
            }
        },
        {
            id: 'size-up',
            build(random) {
                const base = { shape: random.pick(SHAPES), color: random.pick(COLORS) };
                const sequence = ['small', 'medium', 'large'].map(size => item(Object.assign({}, base, { size })));
                const answer = item(Object.assign({}, base, { size: 'extra-large' }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ size: 'small' }, { size: 'large' }]) };
            }
        },
        {
            id: 'alternating-shape',
            build(random) {
                const first = random.pick(SHAPES);
                const second = pickDifferent(SHAPES, first, 1 + random.int(SHAPES.length - 1));
                const base = { color: random.pick(COLORS), size: random.pick(SIZES.slice(0, 3)) };
                const sequence = [first, second, first].map(shape => item(Object.assign({}, base, { shape })));
                const answer = item(Object.assign({}, base, { shape: second }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ shape: first }, { shape: firstOther(SHAPES, [first, second]) }]) };
            }
        },
        {
            id: 'alternating-color',
            build(random) {
                const first = random.pick(COLORS);
                const second = pickDifferent(COLORS, first, 1 + random.int(COLORS.length - 1));
                const base = { shape: random.pick(SHAPES), size: random.pick(SIZES.slice(0, 3)) };
                const sequence = [first, second, first].map(color => item(Object.assign({}, base, { color })));
                const answer = item(Object.assign({}, base, { color: second }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ color: first }, { color: firstOther(COLORS, [first, second]) }]) };
            }
        },
        {
            id: 'alternating-size',
            build(random) {
                const base = { shape: random.pick(SHAPES), color: random.pick(COLORS) };
                const sequence = ['small', 'large', 'small'].map(size => item(Object.assign({}, base, { size })));
                const answer = item(Object.assign({}, base, { size: 'large' }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ size: 'small' }, { size: 'medium' }]) };
            }
        },
        {
            id: 'alternating-count',
            build(random) {
                const high = 2 + random.int(2);
                const base = { shape: random.pick(SHAPES), color: random.pick(COLORS), size: 'small' };
                const sequence = [1, high, 1].map(count => item(Object.assign({}, base, { count })));
                const answer = item(Object.assign({}, base, { count: high }));
                const otherCount = high === 2 ? 3 : 2;
                return { sequence, answer, distractors: makeDistractors(answer, [{ count: 1 }, { count: otherCount }]) };
            }
        },
        {
            id: 'alternating-position',
            build(random) {
                const first = random.pick(POSITIONS);
                const second = pickDifferent(POSITIONS, first, 1 + random.int(POSITIONS.length - 1));
                const base = { shape: random.pick(SHAPES), color: random.pick(COLORS), size: 'small' };
                const sequence = [first, second, first].map(position => item(Object.assign({}, base, { position })));
                const answer = item(Object.assign({}, base, { position: second }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ position: first }, { position: 'center' }]) };
            }
        },
        {
            id: 'alternating-direction',
            build(random) {
                const first = random.int(4) * 90;
                const second = (first + 90) % 360;
                const base = { shape: 'arrow', color: random.pick(COLORS), size: 'large' };
                const sequence = [first, second, first].map(rotation => item(Object.assign({}, base, { rotation })));
                const answer = item(Object.assign({}, base, { rotation: second }));
                return { sequence, answer, distractors: makeDistractors(answer, [{ rotation: first }, { rotation: (second + 90) % 360 }]) };
            }
        },
        {
            id: 'alternating-shape-color',
            build(random) {
                const firstShape = random.pick(SHAPES);
                const secondShape = pickDifferent(SHAPES, firstShape, 1 + random.int(SHAPES.length - 1));
                const firstColor = random.pick(COLORS);
                const secondColor = pickDifferent(COLORS, firstColor, 1 + random.int(COLORS.length - 1));
                const first = item({ shape: firstShape, color: firstColor });
                const second = item({ shape: secondShape, color: secondColor });
                return {
                    sequence: [clone(first), clone(second), clone(first)],
                    answer: clone(second),
                    distractors: [item({ shape: firstShape, color: secondColor }), item({ shape: secondShape, color: firstColor })]
                };
            }
        },
        {
            id: 'alternating-count-color',
            build(random) {
                const firstColor = random.pick(COLORS);
                const secondColor = pickDifferent(COLORS, firstColor, 1 + random.int(COLORS.length - 1));
                const shape = random.pick(SHAPES);
                const first = item({ shape, color: firstColor, count: 1, size: 'small' });
                const second = item({ shape, color: secondColor, count: 2, size: 'small' });
                return {
                    sequence: [clone(first), clone(second), clone(first)],
                    answer: clone(second),
                    distractors: [item({ shape, color: secondColor, count: 1, size: 'small' }), item({ shape, color: firstColor, count: 2, size: 'small' })]
                };
            }
        }
    ];

    const DIFFICULTY = {
        'alternating-shape': 1,
        'alternating-color': 1,
        'alternating-size': 1,
        'alternating-count': 1,
        'count-up': 2,
        'size-up': 2,
        'alternating-position': 2,
        'alternating-direction': 2,
        'alternating-shape-color': 3,
        'alternating-count-color': 3
    };

    function createRandom(randomFn) {
        const fn = typeof randomFn === 'function' ? randomFn : Math.random;
        return {
            int(max) { return Math.floor(fn() * max); },
            pick(values) { return values[this.int(values.length)]; },
            shuffle(values) {
                const copy = values.slice();
                for (let index = copy.length - 1; index > 0; index--) {
                    const swapIndex = this.int(index + 1);
                    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
                }
                return copy;
            }
        };
    }

    function signature(value) {
        return [value.shape, value.color, value.count, value.size, value.rotation, value.position].join('|');
    }

    function generateGame(roundCount, randomFn) {
        const count = Math.max(1, Math.min(roundCount || 10, TEMPLATES.length));
        const random = createRandom(randomFn);
        const orderedTemplates = [1, 2, 3].flatMap(level => (
            random.shuffle(TEMPLATES.filter(template => DIFFICULTY[template.id] === level))
        ));
        return orderedTemplates.slice(0, count).map(template => {
            const puzzle = template.build(random);
            const choices = random.shuffle([puzzle.answer].concat(puzzle.distractors));
            const answerIndex = choices.findIndex(choice => signature(choice) === signature(puzzle.answer));
            return {
                type: template.id,
                sequence: puzzle.sequence.map(clone),
                choices: choices.map(clone),
                answerIndex
            };
        });
    }

    return { generateGame, signature, templateCount: TEMPLATES.length };
}));
