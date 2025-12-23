import { MatrixNode } from './MatrixNode';

export class ColumnHeaderNode extends MatrixNode {
    public name: string;
    public size: number = 0;

    constructor(name: string);
    constructor(leftNode: MatrixNode, name: string);
    constructor(nameOrLeftNode: string | MatrixNode, name?: string) {
        if (typeof nameOrLeftNode === 'string') {
            // Single argument constructor: ColumnHeaderNode(name)
            super();
            this.name = nameOrLeftNode;
        } else {
            // Two argument constructor: ColumnHeaderNode(leftNode, name)
            super(null, nameOrLeftNode, null);
            this.name = name!;
        }
    }

    public override toString(): string {
        return this.name;
    }
}
