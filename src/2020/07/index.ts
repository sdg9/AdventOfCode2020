import readInput from '../../utils/readInput';
import assert from 'assert';

const rawInput = readInput();
const input = rawInput.split('\n');

/* Tree Data Type */
class TreeNode {
  name: string;
  children: TreeNode[];
  constructor(name: string) {
    this.name = name;
    this.children = [];
  }

  hasChild(name: string, depth = 0): boolean {
    return depth > 0 && this.name === name
      ? true
      : unique(this.children).some((child) => child.hasChild(name, depth + 1));
  }

  childBagCount(depth = 0): number {
    const selfWorth = depth > 0 ? 1 : 0; // don't count root bag as child
    return this.children.reduce((p, c) => p + c.childBagCount(depth + 1), 0) + selfWorth;
  }
}

type StringToTreeNode = Record<string, TreeNode>;

/* Functions */
const unique = (input: TreeNode[]): TreeNode[] => [...new Set(input)];

// Maintain k:v pair of name: TreeNodes for reuse
function getOrCreateNode(nodes: StringToTreeNode, name: string): TreeNode {
  if (nodes[name] == null) {
    const retVal = new TreeNode(name);
    nodes[name] = retVal;
    return retVal;
  } else {
    return nodes[name];
  }
}

const childRE = /(\d+) (.*) bag/;
function parseChildData(input: string) {
  const matches = childRE.exec(input);
  if (matches) {
    const [_, quantity, bag] = matches;
    return {
      quantity: parseInt(quantity, 10),
      bag,
    };
  }
  return null;
}

const rootRE = /^(.*) bags contain (.*)/;
function parseRootData(nodes: StringToTreeNode, input: string): TreeNode {
  const matches = rootRE.exec(input);
  if (matches) {
    const [_, root, children] = matches;
    const rootNode = getOrCreateNode(nodes, root);
    children.split(',').forEach((child) => {
      const childData = parseChildData(child);
      if (childData != null) {
        const childNode = getOrCreateNode(nodes, childData.bag);
        for (let i = 0; i < childData.quantity; i++) {
          // I chose to make it pure tree so if you have 3 red bags I store 3 children that are red bags.
          // otherwise I could have considered trying to maintain a relationship between count
          rootNode.children.push(childNode);
        }
      }
    });
    return rootNode;
  } else {
    return null;
  }
}

const bagToFind = 'shiny gold';
function part1(): number {
  const nodes: StringToTreeNode = {};
  input.forEach((value) => parseRootData(nodes, value));

  return Object.values(nodes).reduce((total, node) => {
    return total + (node.hasChild(bagToFind) ? 1 : 0);
  }, 0);
}

function part2(): number {
  const nodes: StringToTreeNode = {};
  input.forEach((value) => parseRootData(nodes, value));

  return nodes[bagToFind].childBagCount();
}

/* Tests */

assert.strictEqual(part1(), 355);
assert.strictEqual(part2(), 5312);

/* Results */

console.time('Time');
const resultPart1 = part1();
const resultPart2 = part2();
console.timeEnd('Time');

console.log('Solution to part 1:', resultPart1);
console.log('Solution to part 2:', resultPart2);
