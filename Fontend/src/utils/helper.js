export function hexToRgba(hex, alpha) {
    if (hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
export function scrollIntoView(delay) {
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, delay);
}

export const appendNodeToChildren = (list, parentKey, newNode) => {
    return list.map((node) => {
        if (node.key === parentKey) {
            return {
                ...node,
                children: node.children ? [newNode, ...node.children] : [newNode],
            };
        }
        if (node.children) {
            return {
                ...node,
                children: appendNodeToChildren(node.children, parentKey, newNode),
            };
        }

        return node;
    });
};

export const findAndAppendReplies = (list, key, children) =>
    list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: findAndAppendReplies(node.children, key, children),
            };
        }
        return node;
    });
export const findAndRemoveNode = (list, key) => {
    for (let i = 0; i < list.length; i++) {
        const node = list[i];

        if (node.key === key) {
            list.splice(i, 1);
            return list;
        }

        if (node.children) {
            node.children = findAndRemoveNode(node.children, key);
            if (node.children.length === 0) {
                delete node.children;
            }
        }
    }

    return list;
};
