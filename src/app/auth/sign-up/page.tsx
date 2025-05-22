import AuthPage from "@/components/AuthPage";
import styles from "./signup.module.css";

const SignUpPage: React.FC = () => {
  return (
    <div className={styles.SignUpPage}>
      <AuthPage formType={"signup"} />
    </div>
  );
};

export default SignUpPage;
