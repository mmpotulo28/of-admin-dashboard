'use client';
import { useReducer, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import styles from './profile.module.css';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaEdit,
} from 'react-icons/fa';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import Input from '@/components/Common/input';
import Actions from '@/components/Common/Actions';
import { iVariant } from '@/lib/types';
import { VscDiscard } from 'react-icons/vsc';
import { BiSave } from 'react-icons/bi';
import { formReducer } from '@/lib/helpers';
import { initialState, initialStateBlank } from '@/lib/data';
import PopupLoader, { iLoaderVariant } from '@/components/PopupLoader';
import { useGlobalContext } from '@/context/TopNavContext';

interface iProfileFormProps {
  formData: typeof initialStateBlank;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditing: boolean;
  handleEdit: () => void;
  handleCancel: () => void;
}

const useUserData = (email: string | undefined) => {
  const [formData, dispatch] = useReducer(formReducer, initialStateBlank);
  const { setIsLoading } = useGlobalContext();
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/user/profile?email=${email}`);
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_FORM_DATA', data });
        Cookies.set('userProfile', JSON.stringify(data), { expires: 1 / 1440 });
        setIsLoading(true);
      } else {
        setStatusMessage(data.error);
        setIsLoading(true);
      }

      setIsLoading(false);
    };

    if (email) {
      const cachedData = Cookies.get('userProfile');
      if (cachedData) {
        dispatch({ type: 'SET_FORM_DATA', data: JSON.parse(cachedData) });
        setIsLoading(false);
      } else {
        fetchUserData();
      }
    }
  }, [email, setIsLoading]);

  return { formData, dispatch, statusMessage, setStatusMessage };
};

const ProfileForm = ({
  formData,
  handleChange,
  handleSubmit,
  isEditing,
  handleEdit,
  handleCancel,
}: iProfileFormProps) => (
  <form id="user-profile-form" onSubmit={handleSubmit}>
    <Input
      type="text"
      name="first_name"
      id="first_name"
      label="First Name"
      value={formData.first_name}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="last_name"
      id="last_name"
      label="Last Name"
      value={formData.last_name}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="username"
      id="username"
      label="Username"
      value={formData.username}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="email"
      name="email"
      id="email"
      label="Email"
      value={formData.email}
      onChange={handleChange}
      disabled
      required
    />
    <Input
      type="tel"
      name="phone_number"
      id="phone_number"
      label="Phone Number"
      value={formData.phone_number}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="address"
      id="address"
      label="Address"
      value={formData.address}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="city"
      id="city"
      label="City"
      value={formData.city}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="state"
      id="state"
      label="State"
      value={formData.state}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="zip"
      id="zip"
      label="Zip"
      value={formData.zip}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="country"
      id="country"
      label="Country"
      value={formData.country}
      onChange={handleChange}
      disabled={!isEditing}
      required
    />
    <Input
      type="text"
      name="login_provider"
      id="login_provider"
      label="Login Provider"
      value={formData.login_provider}
      disabled
      onChange={handleChange}
    />
    <Input
      type="text"
      name="user_type"
      id="user_type"
      label="User Type"
      value={formData.user_type}
      disabled
      onChange={handleChange}
    />
    <div className={`${styles.socialLinks}`}>
      <h3>Social Links</h3>
      <Input
        type="text"
        name="facebook"
        id="facebook"
        label="Facebook"
        value={formData.facebook}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Facebook"
      />
      <Input
        type="text"
        name="twitter"
        id="twitter"
        label="Twitter"
        value={formData.twitter}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Twitter"
      />
      <Input
        type="text"
        name="instagram"
        id="instagram"
        label="Instagram"
        value={formData.instagram}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Instagram"
      />
      <Input
        type="text"
        name="linkedin"
        id="linkedin"
        label="LinkedIn"
        value={formData.linkedin}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="LinkedIn"
      />
      <Input
        type="text"
        name="github"
        id="github"
        label="Github"
        value={formData.github}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Github"
      />
    </div>
    <div className={`${styles.formGroup} ${styles.buttons}`}>
      {isEditing ? (
        <Actions
          actions={[
            {
              label: 'Save',
              click: handleSubmit,
              disabled: !isEditing,
              iconStart: <BiSave />,
            },
            {
              label: 'Cancel',
              click: handleCancel,
              disabled: !isEditing,
              iconStart: <VscDiscard />,
              variant: iVariant.Secondary,
            },
          ]}
        />
      ) : (
        <Actions
          actions={[
            {
              label: 'Edit',
              click: handleEdit,
              disabled: isEditing,
              variant: iVariant.Secondary,
              iconStart: <FaEdit />,
            },
          ]}
        />
      )}
    </div>
  </form>
);

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { isLoading } = useGlobalContext();
  const session = { user: { email: initialState.email } };
  const { formData, dispatch, statusMessage, setStatusMessage } = useUserData(
    session.user.email
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage('Saving...');
    const response = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: 'SET_FORM_DATA', data });
      setStatusMessage('Profile updated successfully!');
      setIsEditing(false);
      Cookies.set('userProfile', JSON.stringify(data), { expires: 1 / 48 });
    } else {
      setStatusMessage('Failed to update profile');
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setStatusMessage('');
  };

  return (
    <DashboardLayout type="admin">
      {isLoading && <PopupLoader variant={iLoaderVariant.Circle} />}
      <div className={styles.dashboardCards}>
        <div className={`${styles.profileInfo} slideInLeft`}>
          <h3>Profile Info</h3>
          <ProfileForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isEditing={isEditing}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
          />
          {statusMessage && <p>{statusMessage}</p>}
        </div>
        <div className={`${styles.profileBioRight} slide-in`}>
          <div className={styles.profileImage}>
            <Image
              src={formData.avatar_url}
              alt="User Profile Image"
              width={150}
              height={150}
            />
          </div>
          <div className={styles.profileBio}>
            <h3>Social Links</h3>
            <div className={styles.socialLinks}>
              <div className={styles.socialLink}>
                <FaFacebook className={styles.icon} />
                <a
                  href={formData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </div>
              <div className={styles.socialLink}>
                <FaTwitter className={styles.icon} />
                <a
                  href={formData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </div>
              <div className={styles.socialLink}>
                <FaInstagram className={styles.icon} />
                <a
                  href={formData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
              <div className={styles.socialLink}>
                <FaLinkedin className={styles.icon} />
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
              <div className={styles.socialLink}>
                <FaGithub className={styles.icon} />
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
