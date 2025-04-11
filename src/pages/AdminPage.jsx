import UserList from "../components/UserList";
import SideBar from "../components/SideBar";

const AdminPage = () => {
    return (
      <div className="flex">
          <SideBar />
      <div className="container mx-auto flex justify-center items-center ">
        <div className="flex justify-center items-center">

        <UserList />
        </div>
      </div>
      </div>
    );
  };
  
  export default AdminPage;