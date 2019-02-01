import { ILexingError, IRecognitionException } from "chevrotain";
export declare function parse(text: string): {
    cst: any;
    lexErrors: ILexingError[];
    parseErrors: IRecognitionException[];
};
