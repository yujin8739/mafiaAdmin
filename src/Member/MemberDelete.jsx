import axios from "axios";


const MemberDelete = () => {
   const userName = "exampleUser";
   const handleDeleteMember = async() => {
      const response = await axios.post("/api/memberDelete",{userName:userName},{
         headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+ localStorage.getItem("token") ,
                    }
      });
      console.log("삭제 응답:", response.data);
   };   
   return ( 
      <button onClick={handleDeleteMember}>Delete Member</button>
   );
};
export default MemberDelete;