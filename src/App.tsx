import './App.scss';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import avatar from './images/bozai.png';
import _ from "lodash";

// Type for the replies
type Reply = {
    rpid: string;
    user: {
        uid: string;
        avatar: string;
        uname: string;
    };
    content: string;
    ctime: string;
    like: number;
};

// Predefined user data and replies
const user = {
    uid: '30009257',
    avatar,
    uname: 'John',
};

// Initial default list of replies

// NavBar component
const NavBar = ({total_reply, activeTab, setActiveTab}: {
    total_reply: number;
    activeTab: string;
    setActiveTab: (tab: string) => void
}) => {
    return (
        <div className="reply-navigation">
            <ul className="nav-bar">
                <li className="nav-title">
                    <span className="nav-title-text">Comments</span>
                    <span className="total-reply">{total_reply}</span>
                </li>
                <li className="nav-sort">
          <span
              className={`nav-item ${activeTab === 'hot' ? 'active' : ''}`}
              onClick={() => setActiveTab('hot')}
          >
            Top
          </span>
                    <span
                        className={`nav-item ${activeTab === 'newest' ? 'active' : ''}`}
                        onClick={() => setActiveTab('newest')}
                    >
            Newest
          </span>
                </li>
            </ul>
        </div>
    );
};

// ReplyItem component
const ReplyItem = ({item}: { item: Reply }) => (
    <div className="reply-item">
        <div className="content-wrap">
            <div className="user-info">
                <div className="user-name">{item.user.uname}</div>
            </div>
            <div className="root-reply">
                <span className="reply-content">{item.content}</span>
                <div className="reply-info">
                    <span className="reply-time">{item.ctime}</span>
                    <span className="reply-time">Likes: {item.like}</span>
                    <span className="delete-btn">Delete</span>
                </div>
            </div>
        </div>
    </div>
);

// ReplyList component with sorting logic
const ReplyList = ({list, activeTab}: { list: Reply[], activeTab: string }) => {
    const sortedList = _.orderBy(
        list,
        [activeTab === 'newest' ? (reply: Reply) => dayjs(reply.ctime) : 'like'],
        ['desc']
    );

    return (
        <div className="reply-list">
            {sortedList.map((item: Reply) => (
                <ReplyItem key={item.rpid} item={item}/>
            ))}
        </div>
    );
};

// CommentSection component
const CommentSection = ({addNewReply}: { addNewReply: (reply: string) => void }) => {
    const [content, setContent] = useState<string>("");

    const handlePostClick = () => {
        if (content.trim()) {
            addNewReply(content);
            setContent(""); // Clear the input field after posting
        }
    };

    return (
        <div className="reply-wrap">
            <div className="box-normal">
                <div className="reply-box-avatar">
                    <div className="bili-avatar">
                        <img className="bili-avatar-img" src={avatar} alt="Profile"/>
                    </div>
                </div>
                <div className="reply-box-wrap">
          <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="reply-box-textarea"
              placeholder="Tell something..."
          />
                    <div className="reply-box-send">
                        <div className="send-text" onClick={handlePostClick}>Post</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// App component
const App = () => {
    // Keep the defaultList as the initial value for replies
    const [replies, setReplies] = useState<Reply[]>([]);
    // State to track the active tab ('hot' for likes, 'newest' for time)
    const [activeTab, setActiveTab] = useState<string>('hot');

    useEffect(()=>{
        const fetchReplies = async () => {
            try {
                const response = await fetch('http://localhost:3004/replies');
                const data: Reply[] = await response.json();
                setReplies(data)

            } catch (error) {
                console.error('Error fetching replies:', error);
            }
        };
        fetchReplies();
    }, []);

    const addNewReply = (reply: string) => {
        const newReply: Reply = {
            rpid: uuidv4(),
            user: user,
            content: reply,
            ctime: dayjs().format("MM-DD-YYYY HH:mm"),
            like: 0,
        };
        setReplies([...replies, newReply]);
    };

    return (
        <div className="app">
            {/* NavBar */}
            <NavBar total_reply={replies.length} activeTab={activeTab} setActiveTab={setActiveTab}/>

            {/* CommentSection */}
            <CommentSection addNewReply={addNewReply}/>

            {/* ReplyList with sorted replies based on activeTab */}
            <ReplyList list={replies} activeTab={activeTab}/>
        </div>
    );
};

export default App;