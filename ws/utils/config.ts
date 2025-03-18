import * as fs from 'fs';
import * as yaml from 'js-yaml';

let config: any;

export function getConfigValue(filePath: string, keyPath: string): any {
    try {
        if (!config) {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            config = yaml.load(fileContents);
        }

        // 按 '.' 分割键路径
        const keys = keyPath.split('.');
        let value = config;

        // 遍历键路径
        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                throw new Error(`Key "${keyPath}" not found in YAML file.`);
            }
        }

        return value;
    } catch (error) {
        console.error('Error reading or parsing YAML file:', error);
        return null;
    }
}

// 示例：读取嵌套键
// const nestedValue = getConfigValue("../config.yaml", 'config.quicknote.wss');
// console.log('value:', nestedValue);
