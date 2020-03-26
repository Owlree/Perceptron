export declare class Color {
    private _red;
    private _green;
    private _blue;
    private _alpha;
    constructor(red: number, green: number, blue: number, alpha?: number);
    toCSS(): string;
    mix(that: Color, percentage: number): Color;
    withAlpha(alpha: number): Color;
    set red(red: number);
    set green(green: number);
    set blue(blue: number);
    set alpha(alpha: number);
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
}
//# sourceMappingURL=color.d.ts.map