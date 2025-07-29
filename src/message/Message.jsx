import MessageList from "./MessageList.jsx";
import MessageSearch from "./MessageSearch.jsx";
import MessageDelete from "./MessageDelete.jsx";
import "../css/message/Message.css";
import MessageDetail from "./MessageDetail.jsx";
import MessageEdit from "./MessageEdit.jsx";

const Message = () => {
   return (
      <div className="message-container">
         <h2>쪽지 관리</h2>
         <MessageSearch/>
         <MessageDelete/>
         <MessageList/>
         <MessageDetail/>
         <MessageEdit/>
      </div>
   )
};   

export default Message;