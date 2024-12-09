import { reactive, watch } from '../src/core/reactive';

// 创建一个用户对象
interface User {
    name: string;
    age: number;
}

// 创建响应式对象
const user = reactive<User>({
    name: "John",
    age: 25
});

// 监听属性变化
watch(user, (changeEvent) => {
    console.log('Property changed:', changeEvent);
    // changeEvent 的类型是 PropertyChangeEvent<any>
    // 包含: 
    // - key: 变化的属性名
    // - value: 新值
    // - oldValue: 旧值
});

// 当我们修改属性时，watch 回调会被触发
user.name = "Jane"; // 会触发 watch 回调
// 控制台输出:
// Property changed: {
//     key: "name",
//     value: "Jane",
//     oldValue: "John"
// }

user.age = 26; // 也会触发 watch 回调
// 控制台输出:
// Property changed: {
//     key: "age",
//     value: 26,
//     oldValue: 25
// }

// 如果值没有变化，则不会触发回调
user.name = "Jane"; // 不会触发回调，因为值没变
