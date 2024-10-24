import { message } from "antd";
import "./styles.module.css";

interface CustomMessageProps {
  content: string;
}

const CustomMessage = ({ content }: CustomMessageProps) => {
  message.open({
    content,
    className: "ant-message-custom-content",
    duration: 5,
  });

  return null;
};

export default CustomMessage;
