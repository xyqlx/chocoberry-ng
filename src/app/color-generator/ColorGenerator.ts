export class ColorGenerator {
    constructor(
        public saturation: number = 0.8,
        public lightness: number = 0.5
    ) {
    }

    hues: Map<string | number, number> = new Map();

    exists(key: number | string): boolean{
        return this.hues.has(key);
    }

    copyFrom(other: ColorGenerator) {
        this.saturation = other.saturation;
        this.lightness = other.lightness;
        this.hues = new Map(other.hues);
    }

    // 按照0~1的范围，返回颜色，并且避免和现有的颜色重复
    tempMapColor(num: number){
        let hue = num % 1;
        // 如果已经存在和这个颜色相近的颜色（只能避免第一次roll中）
        if (this.hues.size > 0) {
            const hueValues = Array.from(this.hues.values());
            for (const hueValue of hueValues) {
                if (Math.abs(hueValue - hue) < 0.01) {
                    hue = (hue + 0.5) % 1;
                    break;
                }
            }
        }
        return `hsl(${hue * 360}, ${this.saturation * 100}%, ${this.lightness * 100}%)`;
    }

    get(key: number | string): string {
        let hue = 0;
        if (this.hues.has(key)) {
            hue = this.hues.get(key) ?? 0;
        }
        // 随机选择一个初始位置
        else if (this.hues.size === 0) {
            hue = Math.random();
        } else {
            // 初始空白段为末尾和开头拼起来的段
            const hueValues = Array.from(this.hues.values()).sort();
            let left = Math.max(...hueValues);
            let right = Math.min(...hueValues);
            let length = 1.0 - left + right;
            // 寻找最长的空白段
            for (let i = 1; i < hueValues.length; i++) {
                const point = hueValues[i];
                const newLength = point - right;
                if (newLength > length) {
                length = newLength;
                left = right;
                }
                right = point;
            }
            // 在这个空白段中选择颜色，带一点点随机要素
            const offset = length / 2;
            hue = left + offset + length / 8 * (Math.random() - 0.5);
            // 保证在0-1之间
            hue -= Math.floor(hue);
        }
        this.hues.set(key, hue);
        return `hsl(${hue * 360}, ${this.saturation * 100}%, ${this.lightness * 100}%)`;
    }

    regenerate(){
        const keys = Array.from(this.hues.keys());
        this.hues.clear();
        for (const key of keys) {
            this.get(key);
        }
    }

    autoClear(saved: Set<string | number>) {
        for (const key of this.hues.keys()) {
            if (!saved.has(key)) {
                this.hues.delete(key);
            }
        }
    }
}