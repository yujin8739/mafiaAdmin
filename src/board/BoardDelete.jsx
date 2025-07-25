const BoardDelete = () => {
    
        const handleDelete = async (e) => {
            e.preventDefault();
            const response = await axios.post('/api/board/delete', 
                { boardId: 1 }, 
                {
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+ localStorage.getItem("token") ,
                    
                    }
                }
            );;
        }

        return (
            <div>
                <button onClick={handleDelete}>게시글 삭제</button>
            </div>
        );

        
    
};

export default BoardDelete;