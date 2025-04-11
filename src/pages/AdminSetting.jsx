import SideBar from "../components/SideBar";
import Setting from "../components/Setting";
import Probability from "../components/Probability";

const AdminSetting = () => {

  return (
    <div>
      <div className="flex gap-20">
        <SideBar />
        <div className="py-24">
          <Setting />
        </div>
        <div className="py">
          <Probability />
        </div>
      </div>

   
    </div>
  );
};

export default AdminSetting;
