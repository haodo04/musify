import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleLoginButton = () => {
  const buttonRef = useRef(null);
  const { loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const handleCredentialResponse = async (response) => {
      try {
        await loginWithGoogle(response.credential);
        toast.success("Đăng nhập thành công!", { style: { background: "#282828", color: "#fff" } });
        navigate("/");
      } catch (err) {
        toast.error("Đăng nhập Google thất bại, thử lại sau", { style: { background: "#282828", color: "#fff" } });
      }
    };

    const tryInit = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "filled_black",
          size: "large",
          width: 340,
          shape: "pill",
          text: "continue_with",
          logo_alignment: "center",
        });

        clearInterval(intervalId);
      }
    };

    intervalId = setInterval(tryInit, 100);
    tryInit();

    return () => clearInterval(intervalId);
  }, [loginWithGoogle, navigate]);

  return <div ref={buttonRef} className="flex justify-center w-full" />;
};

export default GoogleLoginButton;