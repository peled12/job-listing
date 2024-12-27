import ReactMarkDown from "react-markdown";

const MarkDownComponent = ({ text }: { text: string | undefined }) => {
  const handleImageRender = (props: { src?: string }) => {
    if (!props.src) return null; // return nothing if the src is empty

    return <img {...props} />;
  };

  return (
    <ReactMarkDown components={{ img: handleImageRender }}>
      {text}
    </ReactMarkDown>
  );
};

export default MarkDownComponent;
