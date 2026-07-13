import { useNavigate } from "react-router-dom";

const SectionHeader = ({ title, seeAllPath }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between my-5">
      <h1 className="font-bold text-2xl">{title}</h1>
      {seeAllPath && (
        <p
          onClick={() => navigate(seeAllPath)}
          className="text-sm font-semibold text-[#a7a7a7] hover:text-white hover:underline cursor-pointer"
        >
          Hiện tất cả
        </p>
      )}
    </div>
  );
};

export default SectionHeader;