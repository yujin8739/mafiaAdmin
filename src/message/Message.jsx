import MessageList from "./MessageList.jsx";
import MessageSearch from "./MessageSearch.jsx";
import MessageDelete from "./MessageDelete.jsx";
import "../css/message/Message.css";

const Message = () => {
   return (
      <div className="message-container">
         <h2>쪽지 관리</h2>
         <MessageSearch/>
         <MessageDelete/>
         <MessageList/>
      </div>
   )
};   

export default Message;