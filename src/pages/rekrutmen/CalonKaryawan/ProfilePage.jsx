import { useState } from 'react';
import Navbar from "../../../components/Navbar";
import ProfileView from "../../../components/rekrutmen/CalonKaryawan/profilUser/ProfileView";
import EditProfile from "../../../components/rekrutmen/CalonKaryawan/profilUser/EditProfile";
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const handleSaveSuccess = (updatedData) => {
    setProfileData(updatedData);
    setIsEditing(false);
   
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5 pt-40">
        {isEditing ? (
          <EditProfile 
            onCancel={() => setIsEditing(false)}
            onSaveSuccess={handleSaveSuccess}
            initialData={profileData}
          />
        ) : (
          <ProfileView 
            onEditClick={() => setIsEditing(true)}
            profileData={profileData}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage;