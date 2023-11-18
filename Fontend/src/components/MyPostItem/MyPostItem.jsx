import React from 'react';
import { Avatar, Flex } from 'antd';

const MyPostItem = () => {
    return (
        <div>
            <div className="my-post-item">
                <div className="author">
                    <Avatar
                        src="https://vietabinhdinh.edu.vn/wp-content/uploads/Anh-Avatar-Dep-Ngau-Chat-Xi-Khoi-Lam-Hinh-Dai.jpg"
                        size={45}
                    />
                    <Flex vertical>
                        <span>Long</span>
                        <span>Sep 1</span>
                    </Flex>
                </div>
                <h3 className="title">✨ 8 components to become a React master 🧙‍♂️ 🪄</h3>
                <div className="">
                    <Flex gap={10}>
                        <span className="tag">#hsdhh</span>
                        <span className="tag">#hsdhh</span>
                    </Flex>
                    <div className="read-ago">read 1h</div>
                </div>
            </div>
        </div>
    );
};

export default MyPostItem;
