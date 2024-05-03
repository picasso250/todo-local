/**
 * 根据指定的配置创建一个 HTML 元素。
 * 
 * @version 0.0.1
 * 
 * @param {Object} config - 元素的配置对象。
 * @param {string} config.tag - 元素的标签名。
 * @param {string[]} config.classes - 要添加到元素的类名数组。
 * @param {Object} config.attributes - 要添加到元素的属性对象。
 * @param {Object} config.events - 要添加到元素的事件监听对象。
 * @param {Object} config.styles - 要添加到元素的样式对象。
 * @param {(string|HTMLElement|Object)[]} config.children - 元素的子元素或文本内容数组。
 * @param {string} config.text - 元素的文本内容。
 * @param {string} config.html - 元素的 inner HTML。
 * @param {Object} config.data - 要添加到元素的数据对象。
 * @returns {HTMLElement} 创建的元素。
 */
function makeElement(config) {
    const { tag, classes, attributes, events, styles, children, text, html, data } = config;

    // 创建元素
    const element = document.createElement(tag);

    // 添加类名
    if (classes && Array.isArray(classes)) {
        element.classList.add(...classes);
    }

    // 添加属性
    if (attributes && typeof attributes === 'object') {
        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
    }

    // 添加样式
    if (styles && typeof styles === 'object') {
        for (const key in styles) {
            if (styles.hasOwnProperty(key)) {
                element.style[key] = styles[key];
            }
        }
    }

    // 添加文本内容或 inner HTML
    if (text && typeof text === 'string') {
        element.textContent = text;
    }
    if (html && typeof html === 'string') {
        element.innerHTML = html;
    }

    // 添加子元素
    if (children && Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else if (typeof child === 'object') {
                const childElement = makeElement(child);
                element.appendChild(childElement);
            }
        });
    }

    // 添加事件
    if (events && typeof events === 'object') {
        for (const key in events) {
            if (events.hasOwnProperty(key)) {
                if (key === 'keys') {
                    // 添加键盘事件监听
                    const keys = events[key];
                    for (let keyName in keys) {
                        if (keys.hasOwnProperty(keyName)) {
                            let f = keys[keyName];
                            if (Array.isArray(f)) {
                                // 如果desc是function，就用数组包起来
                                let descs = f.map(desc => typeof desc === 'function' ? [desc] : desc);
                                descs.sort((a, b) => b.length - a.length);
                                element.addEventListener("keydown", function (e) {
                                    if (e.key === keyName) {
                                        for (let desc of descs) {
                                            let cks=[...desc];
                                            f = cks.pop();
                                            // now cks is control keys
                                            if (cks.every(name => e[name + "Key"])) {
                                                f(e);
                                                break;
                                            }
                                        }
                                    }
                                });
                            } else {
                                element.addEventListener("keydown", function (e) {
                                    if (e.key === keyName) {
                                        f(e);
                                    }
                                });
                            }
                        }
                    }
                } else {
                    // 添加其他事件监听
                    element.addEventListener(key, events[key]);
                }
            }
        }
    }

    // 添加数据
    if (data && typeof data === 'object') {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                element.dataset[key] = data[key];
            }
        }
    }

    return element;
}
